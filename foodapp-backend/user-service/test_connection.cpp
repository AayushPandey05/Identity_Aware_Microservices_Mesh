#include <mysql.h>
#include <iostream>
#include <string>

using namespace std;

int main() {
    MYSQL* conn = mysql_init(NULL);

    // Get these from your .env
    string host = "foodapp-db.clyk8ag4gkbt.ap-south-1.rds.amazonaws.com";
    string user = "admin";
    string pass = "76072pandey";
    string db   = "foodapp";

    // --- ADD THIS TO FIX THE SSL ERROR ---
    unsigned int ssl_mode = SSL_MODE_DISABLED;
    mysql_options(conn, MYSQL_OPT_SSL_MODE, &ssl_mode);
    // -------------------------------------

    cout << "Connecting to RDS..." << endl;

    if (mysql_real_connect(conn, host.c_str(), user.c_str(), pass.c_str(), db.c_str(), 3306, NULL, 0)) {
        cout << "YEEE, Success! Laptop is now talking to AWS RDS." << endl;
    }
    
    else {
        cout << "❌ Connection Error: " << mysql_error(conn) << endl;
    }

    mysql_close(conn);
    return 0;
}