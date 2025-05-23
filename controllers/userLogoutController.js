



const userLogout = async (req,res,next) => {
    res.clearCookie('jwt')
    res.clearCookie('jwt2')
    return res.status(200).json({"status":200,"message":"Cookie Has Been Cleared"})

}
export {userLogout}