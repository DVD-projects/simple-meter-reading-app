CREATE TABLE IF NOT EXISTS customer(
    acc_no VARCHAR(20) PRIMARY KEY ,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS meter_readings(
    account_no VARCHAR(20)  ,
    reading_date DATE NOT NULL ,
    reading_value INT NOT NULL ,
    CONSTRAINT f_key FOREIGN KEY (account_no) REFERENCES customer(acc_no),
    CONSTRAINT p_key PRIMARY KEY (account_no,reading_date)
);