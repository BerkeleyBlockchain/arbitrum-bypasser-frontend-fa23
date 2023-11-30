import React from 'react';
import { useNavigate } from 'react-router-dom';

function Square({ name, type, imageLink }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/transactions', { state: { name } });
  };

  return (
    <div style={{ 
      width: '200px', 
      height: '200px', 
      backgroundColor: 'rgba(25, 22, 28, 1)',
      borderRadius: '15px',
      overflow: 'hidden',
      position: 'relative',
      padding: '10px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center', // Center children horizontally
    }}>
      <img src={imageLink} alt={name} style={{ 
        width: '100px', 
        height: '100px',
        objectFit: 'cover',
        marginTop: '10px',
      }} />
      <div style={{ 
        position: 'absolute', 
        bottom: '10px', 
        left: '10px', 
        right: '10px' 
      }}>
    <div style={{
        backgroundColor: 'rgba(153, 69, 255, 1)', 
        borderRadius: '20px',
        padding: '5px 10px',
        lineHeight: '12.25px',
        letterSpacing: '39%',
        fontFamily: 'Helvetica',
        fontSize: '10px',
        color: 'white',
        maxWidth: '35%',
        alignSelf: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }}>
          {type}
        </div>
        <h3 style={{
          color: 'white',
          padding: '5px 0',
          fontFamily: 'Helvetica',
          fontSize: '14px',
          textAlign: 'Left',
        }}>
          {name}
        </h3>
      </div>
      <div onClick={handleClick} style={{
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        backgroundColor: 'white',
        borderRadius: '50%',
        width: '30px',
        height: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer'
      }}>
        <div style={{ transform: 'rotate(-45deg)' }}>→</div>
      </div>
    </div>
  );
}

export default Square;
