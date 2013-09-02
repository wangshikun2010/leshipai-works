<?php

header("Expires: Mon, 26 Jul 1970 05:00:00 GMT");
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title>乐食派门店收银系统首页</title>

<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="Cache-Control" content="max-age=0">
<meta http-equiv="expires" content="-1">
    <link type="text/css" href="./css/reset.css" rel="stylesheet">
    <link type="text/css" href="./css/public.css" rel="stylesheet">
    <link type="text/css" href="./css/shouyin.css" rel="stylesheet">
    <script type="text/javascript" src="./js/jquery-1.10.2.min.js"></script>
    <script type="text/javascript" src="layer/layer.min.js"></script>
<script type="text/javascript">
var s=Math.random()*10;
	document.getElementById("checkCodeImg").innerHTML="<img src='/checkcode.jsp?rnd="+s+"'/>"; 
</script>
</head>
<body>
	<select id="j-discount-amount" name='j-discount-amount' autocomplete="off">
	<option value="100">全价</option>
	<option value="90">90</option>
	<option value="80">80</option>
	<option value="70">70</option>
	<option value="60">60</option>
	<option value="50">50</option>
	<option value="40">40</option>
	<option value="30">30</option>
</body>
</html>