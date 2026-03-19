#include "crow.h" 
#include "RedisManager.h"        
#include <mysql/mysql.h>          
#include <librdkafka/rdkafka.h> 
#include <jwt-cpp/jwt.h> 
#include <iostream>
#include <string>
#include <chrono>
#include <cstdlib> // Required for getenv

using namespace std;

// Helper to get Environment Variables (Matches your docker-compose.yml)
string get_env_var(const char* key, string default_val) {
    const char* val = getenv(key);
    return (val != nullptr) ? string(val) : default_val;
}

// Generate JWT for Aayush's App
string generate_auth_token(string username, string email) {
    auto token = jwt::create()
        .set_type("JWS")
        .set_issuer("foodapp-auth")
        .set_issued_at(chrono::system_clock::now())
        .set_expires_at(chrono::system_clock::now() + chrono::hours{24})
        .set_payload_claim("username", jwt::claim(username))
        .set_payload_claim("email", jwt::claim(email))
        .set_payload_claim("scope", jwt::claim(string("user:standard"))) 
        .sign(jwt::algorithm::hs256{get_env_var("JWT_SECRET", "aayush_secret_key_76072")}); 
    return token;
}

// Kafka Dual-Broadcasting
void send_identity_and_event(const char* username, string jwt_token) {
    char errstr[512];
    rd_kafka_conf_t *conf = rd_kafka_conf_new();
    rd_kafka_conf_set(conf, "bootstrap.servers", "foodapp-kafka-broker-lpu-e79e.k.aivencloud.com:21836", errstr, sizeof(errstr));
    rd_kafka_conf_set(conf, "security.protocol", "ssl", errstr, sizeof(errstr));
    rd_kafka_conf_set(conf, "ssl.ca.location", "/app/certificates/ca.pem", errstr, sizeof(errstr));
    rd_kafka_conf_set(conf, "ssl.certificate.location", "/app/certificates/service.cert", errstr, sizeof(errstr));
    rd_kafka_conf_set(conf, "ssl.key.location", "/app/certificates/service.key", errstr, sizeof(errstr));

    rd_kafka_t *rk = rd_kafka_new(RD_KAFKA_PRODUCER, conf, errstr, sizeof(errstr));
    if (!rk) return;

    string business_msg = "{\"event\": \"USER_CREATED\", \"username\": \"" + string(username) + "\"}";
    rd_kafka_topic_t *rkt_biz = rd_kafka_topic_new(rk, "user-events", NULL);
    rd_kafka_produce(rkt_biz, RD_KAFKA_PARTITION_UA, RD_KAFKA_MSG_F_COPY, (void*)business_msg.c_str(), business_msg.length(), NULL, 0, NULL);

    string audit_msg = "{\"action\": \"IDENTITY_ISSUED\", \"user\": \"" + string(username) + "\", \"token\": \"" + jwt_token + "\"}";
    rd_kafka_topic_t *rkt_audit = rd_kafka_topic_new(rk, "identity-audit-logs", NULL);
    rd_kafka_produce(rkt_audit, RD_KAFKA_PARTITION_UA, RD_KAFKA_MSG_F_COPY, (void*)audit_msg.c_str(), audit_msg.length(), NULL, 0, NULL);

    rd_kafka_flush(rk, 5000); 
    rd_kafka_topic_destroy(rkt_biz);
    rd_kafka_topic_destroy(rkt_audit);
    rd_kafka_destroy(rk);
}

int main() {
    crow::SimpleApp app;

    // ---------------------------------------------------------
    // 1. HEALTH CHECK ROUTE (The missing piece for the monitor)
    // ---------------------------------------------------------
    CROW_ROUTE(app, "/api/health")([](){
        crow::response res(200, "OK");
        res.add_header("Access-Control-Allow-Origin", "*");
        return res;
    });

    // ---------------------------------------------------------
    // 2. REGISTER ROUTE
    // ---------------------------------------------------------
    CROW_ROUTE(app, "/api/register").methods("POST"_method, "OPTIONS"_method)([](const crow::request& req){
        crow::response res;
        res.add_header("Access-Control-Allow-Origin", "*");
        res.add_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        res.add_header("Access-Control-Allow-Headers", "Content-Type, Authorization");

        if (req.method == "OPTIONS"_method) { res.code = 204; return res; }

        auto x = crow::json::load(req.body);
        if (!x) { res.code = 400; res.body = "Invalid JSON"; return res; }

        string username = x["username"].s();
        string email = x["email"].s();

        MYSQL* conn = mysql_init(NULL);
        if (mysql_real_connect(conn, get_env_var("DB_HOST", "db").c_str(), get_env_var("DB_USER", "root").c_str(), get_env_var("DB_PASS", "password").c_str(), "foodapp", 3306, NULL, 0)) {
            string query = "INSERT INTO users (username, email, password) VALUES ('" + username + "', '" + email + "', 'secure_hash')";
            if (!mysql_query(conn, query.c_str())) {
                RedisManager::cacheUser(username, email);
                string jwt_token = generate_auth_token(username, email);
                send_identity_and_event(username.c_str(), jwt_token);
                mysql_close(conn);
                
                crow::json::wvalue success_res;
                success_res["status"] = "success";
                success_res["token"] = jwt_token;
                res.code = 200;
                res.body = success_res.dump();
                return res;
            }
        }
        if (conn) mysql_close(conn);
        res.code = 500; res.body = "Registration Error"; return res;
    });

    // ---------------------------------------------------------
    // 3. LOGIN ROUTE
    // ---------------------------------------------------------
    CROW_ROUTE(app, "/api/login").methods("POST"_method, "OPTIONS"_method)([](const crow::request& req){
        crow::response res;
        res.add_header("Access-Control-Allow-Origin", "*");
        res.add_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        res.add_header("Access-Control-Allow-Headers", "Content-Type, Authorization");

        if (req.method == "OPTIONS"_method) { res.code = 204; return res; }

        auto x = crow::json::load(req.body);
        if (!x) { res.code = 400; res.body = "Invalid JSON"; return res; }

        string email = x["email"].s();

        MYSQL* conn = mysql_init(NULL);
        if (mysql_real_connect(conn, get_env_var("DB_HOST", "db").c_str(), get_env_var("DB_USER", "root").c_str(), get_env_var("DB_PASS", "password").c_str(), "foodapp", 3306, NULL, 0)) {
            string query = "SELECT username FROM users WHERE email = '" + email + "' AND password_hash = 'secure_hash' LIMIT 1";
            
            if (mysql_query(conn, query.c_str()) == 0) {
                MYSQL_RES* result = mysql_store_result(conn);
                if (MYSQL_ROW row = mysql_fetch_row(result)) {
                    string username = row[0];
                    string jwt_token = generate_auth_token(username, email);

                    crow::json::wvalue success_res;
                    success_res["status"] = "success";
                    success_res["token"] = jwt_token;
                    success_res["username"] = username;

                    mysql_free_result(result);
                    mysql_close(conn);
                    res.code = 200;
                    res.body = success_res.dump();
                    return res;
                }
                mysql_free_result(result);
            }
        }
        if (conn) mysql_close(conn);
        res.code = 401; res.body = "Invalid Credentials"; return res;
    });

    cout << "🚀 Aayush's Backend Identity Service listening on Port 8080..." << endl;
    app.port(8080).multithreaded().run();
}