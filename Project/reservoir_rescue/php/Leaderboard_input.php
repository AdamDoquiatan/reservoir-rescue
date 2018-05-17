<?php
    $servername = "localhost";
    $dblogin = "root";
    $password = "";
    $dbname = "test";
    $inputName = $_POST["player_name"];
    $inputScore = $_POST["score"];
    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $dblogin, $password);

        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $sql = "INSERT INTO leaderboard (player_name, score)
            VALUES (\"$inputName\", $inputScore)";

        $conn->exec($sql);
        echo "worked";           

    } catch(PDOException $e) {
        echo $e->getMessage();
    }

    $conn = null;
?>