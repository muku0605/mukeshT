## find matching data or ignore case.

const products = await Product.find({
name: { $regex: search, $options: "i" },
});

## sorting

const products = await Product.find({}).sort("name"); //asc

const products = await Product.find({}).sort("-name"); //e=desc

const products = await Product.find({}).sort("-name price");

## get only two column

const products = await Product.find({}).select("name price");

## pagination limit & Skip

const products = await Product.find({})
.select("name price")
.limit(10)
.skip(1);

## filter numeric value

const products = await Product.find({
price: { $gt: 100 },
});

numericFilter=price>40,rating>=4 in query parameter

## JWT

Json web token

## two kind of API

Public:- without JWT token
Resticted:- with JWT token

it use HMAC algorith

it makes combined of Header
Payload
Signature (it is seced by defined bu us)
