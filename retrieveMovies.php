<?php

//again establish connection
$host = "localhost";
$dbname = "hbbtv";
$username = "root";
$password = ""; 

try {

    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $username,
        $password
    );

    // Enable PDO error reporting
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


} catch (PDOException $e) {

    die("Database connection failed: " . $e->getMessage());

}


//sql statement to fetch rows
$sql = "SELECT * FROM  movies";
$stmt = $pdo->prepare($sql);
$stmt->execute();

$movies = $stmt->fetchAll(PDO::FETCH_ASSOC);
$string = json_encode($movies, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

header("Content-Type: application/json");
echo $string;

?>