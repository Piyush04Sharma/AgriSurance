// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';
// import farmerImg from '../assets/farmer.jpg'; // Import same image

// function Register() {
//   const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Farmer' });
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post('http://localhost:5000/api/auth/register', JSON.stringify(formData), {
//         headers: { 'Content-Type': 'application/json' }
//       });
//       setMessage('Account created! Redirecting...');
//       setTimeout(() => navigate('/login'), 2000);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Registration failed.');
//     }
//   };

//   return (
//     <div style={styles.pageWrapper}>
//       <div style={styles.mainCard}>
        
//         {/* LEFT SIDE: FORM */}
//         <div style={styles.leftPanel}>
//           <div style={styles.brand}>CropTrio</div>
//           <h2 style={styles.title}>Create Account</h2>
          
//           <form onSubmit={onSubmit} style={styles.form}>
//             <div style={styles.inputGroup}>
//               <label style={styles.label}>Full Name</label>
//               <input type="text" name="name" value={formData.name} onChange={onChange} style={styles.input} placeholder="John Doe" required />
//             </div>
//             <div style={styles.inputGroup}>
//               <label style={styles.label}>Email address</label>
//               <input type="email" name="email" value={formData.email} onChange={onChange} style={styles.input} placeholder="name@company.com" required />
//             </div>
//             <div style={styles.inputGroup}>
//               <label style={styles.label}>Password</label>
//               <input type="password" name="password" value={formData.password} onChange={onChange} style={styles.input} placeholder="••••••••" required />
//             </div>
//             <div style={styles.inputGroup}>
//               <label style={styles.label}>I am a:</label>
//               <select name="role" value={formData.role} onChange={onChange} style={styles.input}>
//                 <option value="Farmer">Farmer</option>
//                 <option value="Proposer">Insurance Provider</option>
//               </select>
//             </div>
//             <button type="submit" style={styles.loginBtn}>Create account</button>
//           </form>

//           <p style={styles.footerText}>Already have an account? <Link to="/login" style={styles.link}>Log in</Link></p>
//         </div>

//         {/* RIGHT SIDE: IMAGE PANEL */}
//         <div style={{ ...styles.rightPanel, backgroundImage: `url(${farmerImg})` }}>
//            <div style={styles.overlay}>
//               <div style={styles.glassCard}>
//                 <h3 style={{ margin: 0, color: '#d4a948' }}>Join the Portal</h3>
//                 <p style={{ fontSize: '0.85em', margin: '5px 0 0' }}>Manage your crop health and insurance in one place.</p>
//               </div>
//            </div>
//         </div>

//       </div>
//     </div>
//   );
// }

// // Re-using same styles for consistency
// const styles = {
//     pageWrapper: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '85vh', padding: '20px' },
//     mainCard: { display: 'flex', width: '1000px', height: '650px', backgroundColor: '#2b231d', borderRadius: '30px', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.5)', border: '1px solid #444' },
//     leftPanel: { flex: 1, padding: '40px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
//     brand: { color: '#d4a948', fontWeight: 'bold', fontSize: '1.4em', marginBottom: '20px' },
//     title: { fontSize: '1.8em', margin: '0 0 20px', color: '#fff' },
//     form: { width: '100%' },
//     inputGroup: { marginBottom: '15px' },
//     label: { display: 'block', color: '#ddd', fontSize: '0.85em', marginBottom: '5px' },
//     input: { width: '100%', padding: '12px 16px', backgroundColor: '#3d342c', border: '1px solid #555', borderRadius: '12px', color: '#fff', outline: 'none' },
//     loginBtn: { width: '100%', padding: '14px', backgroundColor: '#e1b356', color: '#2b231d', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '1em', cursor: 'pointer', marginTop: '10px' },
//     rightPanel: { flex: 1.2, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' },
//     overlay: { position: 'absolute', bottom: '40px', left: '40px', right: '40px' },
//     glassCard: { padding: '20px', backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(10px)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' },
//     footerText: { textAlign: 'center', marginTop: '20px', fontSize: '0.9em', color: '#aaa' },
//     link: { color: '#e1b356', textDecoration: 'none', fontWeight: 'bold' }
// };

// export default Register;


import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import farmerImg from '../assets/farmer.jpg'; // Import same image

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Farmer' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // FIX: Send raw object (formData). Axios handles JSON and headers automatically.
      await axios.post('http://localhost:5000/api/auth/register', formData);
      
      setMessage('Account created! Redirecting...');
      setError(null); 
      setTimeout(() => navigate('/login'), 2000);

    } catch (err) {
      console.error("Registration Error:", err);
      setError(err.response?.data?.message || 'Registration failed. Please check server status.');
      setMessage(''); 
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.mainCard}>
        
        {/* LEFT SIDE: FORM */}
        <div style={styles.leftPanel}>
          <div style={styles.brand}>AgriSurance</div>
          <h2 style={styles.title}>Create Account</h2>
          
          {message && <p style={{ color: '#4caf50', marginBottom: '15px', fontSize: '0.9em' }}>{message}</p>}
          {error && <p style={{ color: '#ff5252', marginBottom: '15px', fontSize: '0.9em' }}>{error}</p>}
          
          <form onSubmit={onSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={onChange} style={styles.input} placeholder="John Doe" required />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email address</label>
              <input type="email" name="email" value={formData.email} onChange={onChange} style={styles.input} placeholder="name@company.com" required />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input type="password" name="password" value={formData.password} onChange={onChange} style={styles.input} placeholder="••••••••" required />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>I am a:</label>
              <select name="role" value={formData.role} onChange={onChange} style={styles.input}>
                <option value="Farmer">Farmer</option>
                <option value="Proposer">Insurance Provider</option>
              </select>
            </div>
            <button type="submit" style={styles.loginBtn}>Create account</button>
          </form>

          <p style={styles.footerText}>Already have an account? <Link to="/login" style={styles.link}>Log in</Link></p>
        </div>

        {/* RIGHT SIDE: IMAGE PANEL */}
        <div style={{ ...styles.rightPanel, backgroundImage: `url(${farmerImg})` }}>
           <div style={styles.overlay}>
              <div style={styles.glassCard}>
                <h3 style={{ margin: 0, color: '#d4a948' }}>Join the Portal</h3>
                <p style={{ fontSize: '0.85em', margin: '5px 0 0' }}>Manage your crop health and insurance in one place.</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}

// Re-using same styles for consistency (Styles are kept the same)
const styles = {
    pageWrapper: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '85vh', padding: '20px' },
    mainCard: { display: 'flex', width: '1000px', height: '650px', backgroundColor: '#2b231d', borderRadius: '30px', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.5)', border: '1px solid #444' },
    leftPanel: { flex: 1, padding: '40px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
    brand: { color: '#d4a948', fontWeight: 'bold', fontSize: '1.4em', marginBottom: '20px' },
    title: { fontSize: '1.8em', margin: '0 0 20px', color: '#fff' },
    form: { width: '100%' },
    inputGroup: { marginBottom: '15px' },
    label: { display: 'block', color: '#ddd', fontSize: '0.85em', marginBottom: '5px' },
    input: { width: '100%', padding: '12px 16px', backgroundColor: '#3d342c', border: '1px solid #555', borderRadius: '12px', color: '#fff', outline: 'none' },
    loginBtn: { width: '100%', padding: '14px', backgroundColor: '#e1b356', color: '#2b231d', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '1em', cursor: 'pointer', marginTop: '10px' },
    rightPanel: { flex: 1.2, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' },
    overlay: { position: 'absolute', bottom: '40px', left: '40px', right: '40px' },
    glassCard: { padding: '20px', backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(10px)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' },
    footerText: { textAlign: 'center', marginTop: '20px', fontSize: '0.9em', color: '#aaa' },
    link: { color: '#e1b356', textDecoration: 'none', fontWeight: 'bold' }
};

export default Register;