export const registerUser = async (req, res) => {
console.log("register user trigerd>>>>>>")
console.log("register user req.body", req.body)

const { username, email, password } = req.body;

res.status(200).json({ message: "User registered successfully" });

};

export const loginUser = async (req, res) => {
  // Implementation for user login
};