import userIndes from './user-index.js';
const { User, bcrypt, jwt, secretKey, emailService, hbs, path, fs } = userIndes
import Role from '../Models/User-Models/role.model.js';

var findOrCreateRole = async (roleName) => {
    const role = (await Role.findOne({ name: roleName })) || (await Role.create({ name: roleName }));
    return role._id ? role : await role.save();
};

const signUp = async (req, res) => {
    const userData = req.body;

   const saveData = async (roleId) => {
        const salt = 10;
        const hashedPass = await bcrypt.hash(userData.password, salt);
        const dataToSave = new User({
            ...userData,
            password: hashedPass,
            roles: roleId,
        });
        await dataToSave.save();
        res.status(201).json({ data: dataToSave });
    }



    try {
        const checkEmail = await User.findOne({ email: userData.email });
        if (checkEmail) return handleStatusCode(res, "Email already exists", 409);

        // const hashedPass = await bcrypt.hash(userData.password, salt);
        const [userRole, adminRole] = await Promise.all([findOrCreateRole('user'), findOrCreateRole('admin')]);
        if (userData.role == "admin") {
            saveData(adminRole._id)
        } else {
            saveData(userRole._id)
        }
        // saveData(userData._id)

        await Promise.all([userRole.save(), adminRole.save()]);
    
    } catch (error) {
        handleControllerError(res, error, 'Error processing the Sign Up request', 500);
    }



};

const logIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return handleStatusCode(res, "user email not found", 400);

        const cheakHashPass = await bcrypt.compare(password, user.password);
        if (!cheakHashPass) return handleStatusCode(res, "wrong password", 400);

        const token = generateToken(user._id, user.email);
        res.status(200).json({ message: 'Logged In Successfully', data: user, token });
    } catch (error) {
        handleControllerError(res, error, 'Error processing the LogIn request', 500);
    }
};

const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return handleStatusCode(res, 'No user found with this email id in or database', 400);

        const token = generateToken(user._id, user.email);
        const resetPasswordLink = `${token}`;
        const templatePath = path.join(__dirname, './View', 'index.hbs');
        const htmlContent = hbs.compile(fs.readFileSync(templatePath, 'utf8'))({ resetPasswordLink });

        const emailSent = await emailService.sendPasswordResetEmail(user.email, htmlContent);

        return emailSent
            ? res.status(200).json({ message: 'Password reset email sent', token })
            : handleControllerError(res, 'Error sending password reset email', 500);
    } catch (error) {
        handleControllerError(res, error, 'Error processing the forget password request', 500);
    }
};

const resetPassword = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const { newPassword } = req.body;
        const decodedToken = jwt.verify(token.replace('Bearer ', ''), secretKey);
        const email = decodedToken.email;

        const user = await User.findOne({ email });
        if (!user) return handleStatusCode(res, "Email does not exist in database", 401);

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        handleStatusCode(res, 'Password changed successfully', 201);
    } catch (error) {
        handleControllerError(res, error, 'Error processing the reset password request', 500);
    }
};

const updateProfile = async (req, res) => {
    const userData = req.body;
    const loggedInUserId = req.user.userId;

    try {
        const updateUser = await User.findOneAndUpdate({ _id: loggedInUserId }, userData, { new: true });

        return updateUser
            ? res.status(201).json({ message: 'Profile Updated Successfully' })
            : res.status(401).json({ message: "Profile could not be updated" });
    } catch (error) {
        handleControllerError(res, error, 'Error processing the update profile request', 500);
    }
};

const generateToken = (userId, userEmail) => jwt.sign({ userId, email: userEmail }, secretKey, { expiresIn: '1h' });

const handleStatusCode = (res, message, status) => res.status(status).json({ message });

const handleControllerError = (res, error, message = 'Internal Server Error', status = 500) => {
    console.error('Error processing the request:', error);
    return res.status(status).json({ error: message });
};



export default {
    signUp,
    logIn,
    forgetPassword,
    resetPassword,
    updateProfile
};
