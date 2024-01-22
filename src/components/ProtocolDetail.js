import React from 'react';
import ProtocolCard from '../components/ProtocolCard';

const ProtocolDetail = ({ protocolName, contracts }) => {
  return (
    <div>
      <h2>{protocolName}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {contracts.map((contract) => (
          <ProtocolCard
            key={contract.addy}
            addy={contract.addy}
            name={contract.name}
            type={contract.type}
            abi={contract.abi}
            image={contract.image}
          />
        ))}
      </div>
    </div>
  );
};

export default ProtocolDetail;
