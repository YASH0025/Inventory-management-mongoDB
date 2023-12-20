// const checkRole = (role) => {
//   return async (req, res, next) => {
//       try {
//           if (req.user) {
//               const user = await User.findById(req.user._id).populate('roles');
//               const hasRole = user.roles.some((r) => r.name === req.params.roleName && r.isAdmin);

//               // Extract role name from the token
//               const tokenRoleName = req.user.roleName;

//               // Compare the extracted role name with the expected role name
//               if (hasRole && tokenRoleName === role) {
//                   next();
//               } else {
//                   res.status(403).json({ message: 'Permission denied' });
//               }
//           } else {
//               res.status(403).json({ message: 'Permission denied' });
//           }
//       } catch (error) {
//           console.error(error);
//           res.status(500).json({ message: 'Internal server error' });
//       }
//   };
// };

// module.exports = { checkRole };
import Tokens from 'jsonwebtoken';
const { verify } = Tokens
import User from '../Models/User-Models/user.model.js';

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = verify(token, 'your-secret-key');

    const user = await User.findById(decodedToken.userId).populate('roles');
    console.log(user)
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed. User not found.' });
    } else {
      const hasRequiredRole = user.roles.name === 'admin';

      if (hasRequiredRole) {
        next();
      } else {
        res.status(403).json({ message: 'Access forbidden. Insufficient privileges.' });
      }
    }

  } catch (error) {
    console.error("Error in authentication middleware:", error);
    res.status(401).json({ message: 'Authentication failed. Token invalid.' });
  }
};



export default auth;
