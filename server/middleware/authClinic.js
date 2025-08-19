// middleware/authClinic.js
import jwt from 'jsonwebtoken';
import Clinic from '../Schema/Clinic.js';

const authClinic = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Check role
    if (decoded.role != process.env.CLINIC_ROLE) {
      return res.status(403).json({ message: 'Access denied: not a clinic' });
    }

    // Attach clinic to request
    const clinic = await Clinic.findById(decoded.id);
    if (!clinic) return res.status(404).json({ message: 'Clinic not found' });

    req.clinic = clinic;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
export default  authClinic ;