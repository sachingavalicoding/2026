
export const getUser = (req, res, next) => {
  try {
    let users =  [
        { "name": "Sachin", "role": "Developer" },
        { "name": "Prajwal", "role": "Manager" }
    ]

    if (!users || users?.length === 0) {
      const error = new Error("Users not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
        success:true,
        data:users
    });
  } catch (error) {
    next(error); 
  }
};




export const getProfile = (req, res,next) => {
    debugger;
    let user = null;
    if(!user){
        const error = new Error("Profile Not Found");
        error.statusCode = 404;
        return next(error);
    }
    res.status(200).json({
        success:true,
        data:[{
            name: "Sachin",
            role: "Developer"
        }]
    })
}

export const getFriends = (req, res) => {
    res.status(200).json({
        success:true,
        data:[{
            name:'sachin',
            age:19,
            job:'developer'
        }]
    })
}