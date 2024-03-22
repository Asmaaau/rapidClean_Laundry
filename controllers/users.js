exports.details = (req, res) => {
     // console.log("Hey love");
     // console.log(req.user)
     res.status(200).json({message: req.user})
}