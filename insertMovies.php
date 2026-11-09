<?php

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

    echo "Database connection successful!";

} catch (PDOException $e) {

    die("Database connection failed: " . $e->getMessage());

}

$jsonFile = __DIR__ . "/movies.json";
if (!file_exists($jsonFile)) {
    die("Error: JSON file not found!");
}
$jsonContent = file_get_contents($jsonFile);
// Convert JSON into a PHP associative array
$movies = json_decode($jsonContent, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    die("Invalid JSON: " . json_last_error_msg());
}
echo "JSON file loaded successfully!";


//sql statement
$sql = "INSERT INTO movies (title, image, mp4, duration)
        VALUES (:title, :image, :mp4, :duration)";

$stmt = $pdo->prepare($sql);

// Insert all movies
try {

    $pdo->beginTransaction();

    foreach ($movies as $movie) {

        $stmt->execute([
            ":title" => $movie["title"],
            ":image" => $movie["image"],
            ":mp4" => $movie["mp4"],
            ":duration" => $movie["duration"]
        ]);

    }

    $pdo->commit();
    echo "All movies imported successfully!";
} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    
    die("Import failed: " . $e->getMessage());
}


?>


