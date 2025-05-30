// app/(auth)/login/page.tsx
"use client"
import React from 'react';
import LoginForm from '../../components/ui/authForm/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="  lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div>
            {/* <img 
              src="https://storage.googleapis.com/devitary-image-host.appspot.com/15846435184459982716-LogoMakr_7POjrN.png"
              className="w-32 mx-auto" 
              alt="Logo" 
            /> */}
          </div>
          <div className="mt-12 flex flex-col items-center ">
            <h2 className="text-2xl xl:text-3xl font-extrabold">Accedi</h2>
            <div className="w-full flex-1 mt-8 ">
              <div className="flex flex-col items-center">
                

                
              </div>

              

              <div className="mx-auto max-w-xs">
                <LoginForm />
                
                <p className="mt-6 text-xs text-gray-600 text-center">
                  I agree to abide by Simone Pere
                  <a href="#" className="border-b border-gray-500 border-dotted"> Terms of Service </a>
                  and its
                  <a href="#" className="border-b border-gray-500 border-dotted"> Privacy Policy </a>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
          <div className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')" }}>
          </div>
        </div>
      </div>
    </div>
  );
}


