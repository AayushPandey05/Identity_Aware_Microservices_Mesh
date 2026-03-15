#include <librdkafka/rdkafka.h>
#include <iostream>
#include <string>
#include <csignal>

using namespace std;

static bool run = true;
static void stop(int sig) { run = false; }

int main() {
    char errstr[512];
    rd_kafka_conf_t *conf = rd_kafka_conf_new();

    // 1. Connection Settings
    rd_kafka_conf_set(conf, "bootstrap.servers", "foodapp-kafka-broker-lpu-e79e.k.aivencloud.com:21836", errstr, sizeof(errstr));
    rd_kafka_conf_set(conf, "security.protocol", "ssl", errstr, sizeof(errstr));
    rd_kafka_conf_set(conf, "ssl.ca.location", "certificates/ca.pem", errstr, sizeof(errstr));
    rd_kafka_conf_set(conf, "ssl.certificate.location", "certificates/service.cert", errstr, sizeof(errstr));
    rd_kafka_conf_set(conf, "ssl.key.location", "certificates/service.key", errstr, sizeof(errstr));

    // 2. Consumer Group ID
    rd_kafka_conf_set(conf, "group.id", "order_grp_final_check", errstr, sizeof(errstr));
    rd_kafka_conf_set(conf, "enable.auto.commit", "true", errstr, sizeof(errstr));
    rd_kafka_conf_set(conf, "session.timeout.ms", "45000", errstr, sizeof(errstr)); // 45 seconds timeout
    rd_kafka_conf_set(conf, "auto.offset.reset", "earliest", errstr, sizeof(errstr));

    rd_kafka_t *rk = rd_kafka_new(RD_KAFKA_CONSUMER, conf, errstr, sizeof(errstr));
    
    // 3. Subscribe to the topic
    rd_kafka_topic_partition_list_t *topics = rd_kafka_topic_partition_list_new(1);
    rd_kafka_topic_partition_list_add(topics, "order-events", RD_KAFKA_PARTITION_UA);
    rd_kafka_subscribe(rk, topics);

    cout << "🎧 Order Service is LIVE. Waiting for 'User Created' events..." << endl;

    // order_service.cpp ke loop ko aise update karo:
    while (run) {
        rd_kafka_message_t *rkmessage = rd_kafka_consumer_poll(rk, 1000);
        if (rkmessage) {
            if (rkmessage->err == RD_KAFKA_RESP_ERR_NO_ERROR) {
                printf("🔔 NEW MESSAGE RECEIVED: %.*s\n", (int)rkmessage->len, (const char *)rkmessage->payload);
                cout << "🛒 ACTION: Activating 50% discount for this user!" << endl;
            } else if (rkmessage->err == RD_KAFKA_RESP_ERR__PARTITION_EOF) {
                // Ye sirf end of partition hai, koi error nahi
            } else {
                // Yahan humein pata chalega agar koi asli error hai (like SSL issue)
                cerr << "❌ Kafka Consumer Error: " << rd_kafka_message_errstr(rkmessage) << endl;
            }
            rd_kafka_message_destroy(rkmessage);
        }
    }

    rd_kafka_consumer_close(rk);
    rd_kafka_destroy(rk);
    return 0;
}