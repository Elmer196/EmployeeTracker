USE workplace;

CREATE TABLE Employee(
    ID int NOT NULL AUTO_INCREMENT,
    LastName varchar(30) NOT NULL,
    FirstName varchar(30),
    Role_ID int,
    PRIMARY KEY (ID)
);
