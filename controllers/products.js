const product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  // const products = await Product.find({  name: { $regex: search, $options: "i" },});
  const products = await Product.find({
    price: { $gt: 100 },
  });
  //   const products = await Product.find({}).sort("-name price");
  //   const products = await Product.find({}).select("name price");
  //   const products = await Product.find({})
  //     .select("name price")
  //     .limit(10)
  //     .skip(1);

  res.status(200).json({ products, nbHits: products.length });
};

const getAllProducts = async (req, res) => {
  //   console.log(req.query);
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObject = {};
  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }
  //numric filter
  if (numericFilters) {
    // console.log(numericFilters);
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };
    const regEx = /\b(>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    console.log(filters);
    const options = ["price", "rating"];
    filters = filters.split(",").forEach((item) => {
      const [fields, operator, value] = item.split("-");
      if (options.includes(fields)) {
        queryObject[fields] = { [operator]: Number(value) };
      }
    });
    console.log(queryObject);
  }
  let result = product.find(queryObject);
  //sort
  if (sort) {
    const SortList = sort.split(",").join(" ");
    result = result.sort(SortList);
  } else {
    result = result.sort("createdAt");
  }

  //fields
  if (fields) {
    const fieldList = fields.split(",").join(" ");
    result = result.select(fieldList);
  }

  //pages
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(limit);

  const products = await result;
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
  getAllProductsStatic,
  getAllProducts,
};
