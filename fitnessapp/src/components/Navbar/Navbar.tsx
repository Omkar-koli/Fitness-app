"use client"
import React from 'react'
import logo from '@/assests/Logo.png'
import { IoIosBody } from 'react-icons/io'
import './Navbar.css'
import Image from 'next/image'
import Link from 'next/link'
import { IoSad } from 'react-icons/io5'
import { Button } from '@mui/material'
import AuthPopup from '../AuthPopup/AuthPopup'
import AboutPage from '../About/About'



const Navbar = () => {
  const [isloggedin, setIsloggedin] = React.useState<boolean>(false)
  
  const[showpopup, setShowpopup] = React.useState<boolean>(false)
  const checklogin = async () => {
    fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/auth/checklogin',{
      method: 'POST',
      credentials:'include',
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        if (data.ok) {
          setIsloggedin(true)
        }
        else{
          setIsloggedin(false)
        }
      })
      .catch(err => {
        console.log(err)
      })
  };
  const handleLogout = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        setIsloggedin(false);
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    checklogin();
  }, [showpopup]);

  return (
    <nav>
      <Image src={logo} alt="Logo" />
      <Link href='/'>Home</Link>
      <Link href='/About'>About</Link>
      <Link href='/profile'><IoIosBody />Profile</Link>

      {isloggedin ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <button onClick={() => setShowpopup(true)}>Log In</button>
      )}
    

      {showpopup && <AuthPopup setShowpopup={setShowpopup} />}
    </nav>
  );
};

export default Navbar;
