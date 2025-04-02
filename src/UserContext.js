import { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const[profile, setProfile]= useState(null)
  const [currentStep, setCurrentStep] = useState(-1);
  const [userCredit, setUserCredit] = useState('');
  return (
    <UserContext.Provider value={{ userData, setUserData, profile, setProfile,currentStep, setCurrentStep,userCredit,setUserCredit}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

