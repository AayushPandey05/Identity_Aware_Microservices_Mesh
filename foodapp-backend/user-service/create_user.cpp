#include <mysql/mysql.h>        
#include <librdkafka/rdkafka.h> 
#include <iostream>
#include <string>
#include <cstring>
#include <cstdlib>

using namespace std;

// This function sends the "User Created" message to Aiven Kafka
void send_user_event(const char* username) {
    char errstr[512];
    rd_kafka_conf_t *conf = rd_kafka_conf_new();

    // 1. Kafka Connection Settings
    rd_kafka_conf_set(conf, "bootstrap.servers", "foodapp-kafka-broker-lpu-e79e.k.aivencloud.com:21836", errstr, sizeof(errstr));
    rd_kafka_conf_set(conf, "security.protocol", "ssl", errstr, sizeof(errstr));
    
    // 2. SSL Certificates
    rd_kafka_conf_set(conf, "ssl.ca.location", "certificates/ca.pem", errstr, sizeof(errstr));
    rd_kafka_conf_set(conf, "ssl.certificate.location", "certificates/service.cert", errstr, sizeof(errstr));
    rd_kafka_conf_set(conf, "ssl.key.location", "certificates/service.key", errstr, sizeof(errstr));

    rd_kafka_t *rk = rd_kafka_new(RD_KAFKA_PRODUCER, conf, errstr, sizeof(errstr));
    if (!rk) {
        cerr << "❌ Kafka Error: " << errstr << endl;
        return;
    }

    // 3. Create the JSON message
    string message = "{\"event\": \"USER_CREATED\", \"username\": \"" + string(username) + "\"}";

    // 4. The Classic Produce Call (Works everywhere!)
    int res = rd_kafka_produce(
                rd_kafka_topic_new(rk, "order-events", NULL), // Topic name
                RD_KAFKA_PARTITION_UA,                        // Random partition
                RD_KAFKA_MSG_F_COPY,                         // Copy the message buffer
                (void*)message.c_str(), message.length(),    // The data
                NULL, 0,                                     // Optional Key
                NULL);                                       // Message opaque

    if (res == -1) {
        cerr << "❌ Kafka Produce Failed: " << rd_kafka_err2str(rd_kafka_last_error()) << endl;
    } else {
        cout << "📡 Kafka: Message queued for 'order-events'..." << endl;
    }

    // 5. Flush and Clean up
    rd_kafka_flush(rk, 5000); 
    rd_kafka_destroy(rk);
    
    cout << "✅ Kafka: Cleanup complete." << endl;
}

int main() {
    MYSQL* conn = mysql_init(NULL);

    // Your RDS Credentials
    string host = "foodapp-db.clyk8ag4gkbt.ap-south-1.rds.amazonaws.com";
    string user = "admin";
    string pass = "76072pandey";
    string db   = "foodapp";

    if (mysql_real_connect(conn, host.c_str(), user.c_str(), pass.c_str(), db.c_str(), 3306, NULL, 0)) {
        cout << "✅ Connected to RDS!" << endl;

        // NEW DATA (Change this name every time or delete from CloudShell first)
        string username = "Pratyush_Kafka_Test_01";
        string email = "kafka_test_01@gmail.com";
        string pass_hash = "hashed_pw_123"; 

        string query = "INSERT INTO users (username, email, password_hash) VALUES ('" + 
                        username + "', '" + email + "', '" + pass_hash + "')";

        if (mysql_query(conn, query.c_str())) {
            cout << "❌ Insert Error: " << mysql_error(conn) << endl;
        } 
        else {
            cout << "🚀 Success! User added to RDS." << endl;
            
            // 🔥 TRIGGER KAFKA HERE
            send_user_event(username.c_str());
        }
    } 
    else {
        cout << "❌ Connection Error: " << mysql_error(conn) << endl;
    }

    mysql_close(conn);
    return 0;
}