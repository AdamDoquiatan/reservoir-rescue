<?php


    $methodType = $_SERVER['REQUEST_METHOD'];
    
	$servername = "localhost";
    $dblogin = "root";
    $password = "";
    $dbname = "test";
	
	$data = array("status" => "fail", "msg" => "On $methodType");

    if ($methodType === 'GET') {
    
        if(isset($_GET['output'])) {
            $output = $_GET['output'];


        try {
            $conn = new PDO("mysql:host=$servername;dbname=$dbname", $dblogin, $password);

            // set the PDO error mode to exception
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $sql = "SELECT * FROM leaderboard ORDER BY score DESC LIMIT 10";

            $statement1 = $conn->prepare($sql);
            $statement1->execute();
            $count = $statement1->rowCount();
                   
            $data = array("status" => "success", "leaderboard" => $statement1->fetchAll(PDO::FETCH_ASSOC));

        } catch(PDOException $e) {
            $data = array("error", $e->getMessage());
        }
            
    } else {
        $data = array("msg" => "Error: only GET allowed");
    }
        
    $data['status'] = 'success';
    $data['msg'] = 'Retrieving data as JSON';
    $json =  json_encode($data);
    echo $json;
        
    } else {
            echo "Need a type of output!";
			}
?>