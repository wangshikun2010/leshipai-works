<?PHP
	

	if (!isset($_GET['url'])) die('URL error');
	$url = $_GET['url'];
	$urlArray = parse_url ($url);

	$post = $_POST;

	echo post_interface($post, $urlArray['host'], $url);

//POSTÇëÇó
function post_interface($post_data, $host, $url){
	$post_data_string = http_build_query($post_data); 
	$myhead = array(
		'Host: ' . $host ,
		'User-Agent: leshipai (iPad; iPhone OS 6.1.2; zh_CN)' ,
		'Connection: keep-alive' ,
		'Accept-Encoding: gzip' ,
		'Content-Type: application/x-www-form-urlencoded;charset=utf-8' ,
		'DeviceType: iPad' ,
		'Resolution: 2048x1536' ,
		'session_id: ' . session_id(),
		'Content-Length: ' . strlen($post_data_string)
	) ;

	$ch = curl_init() ;
	curl_setopt($ch, CURLOPT_URL,$url) ; 
	curl_setopt($ch, CURLOPT_HEADER, 0); 
	curl_setopt($ch, CURLOPT_POST, 1); 
	curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data_string); 
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);   
	curl_setopt($ch, CURLOPT_HTTPHEADER, $myhead); 
	
	
	$data = curl_exec($ch) ;
	curl_close($ch) ;

	return $data;
}
?>