import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import amirImg from "../img/Amir.png";
import htmlImg from "../img/html.svg";
import cssImg from "../img/css.svg";
import reactImg from "../img/react.svg";
import tailwindImg from "../img/tailwind.svg";
import djangoImg from "../img/django.svg";
import pythonImg from "../img/python.svg";


const About = () => {

  return (
    <main id="about" className="about-section min-h-[80vh] flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-[#1a0036] via-[#2d0b4e] to-[#231942] rounded-3xl shadow-2xl p-8 md:p-20 gap-12 max-w-6xl mx-auto mt-16 border border-[#a259ff] mb-24">
      {/* عکس */}
      <div className="w-full md:w-1/3 flex justify-center items-center">
        <img
          src={amirImg}
          alt="programming themed"
          className="rounded-2xl shadow-xl w-64 object-cover border-4 border-[#a259ff] bg-[#231942]"
        />
      </div>
      {/* متن معرفی */}
      <div className="w-full md:w-2/3 flex flex-col gap-8">
        <h2 className="text-4xl font-extrabold text-[#a259ff] mb-2 drop-shadow-lg">
          About Me
        </h2>
        <p className="text-lg text-gray-200 leading-8 drop-shadow">
          I am a passionate web developer with a strong interest in modern
          technologies. My main expertise is in{" "}
          <span className="text-yellow-400 font-bold">Python</span> and{" "}
          <span className="text-green-400 font-bold">Django</span>, and I also
          work with <span className="text-orange-400 font-bold">HTML</span>,{" "}
          <span className="text-blue-400 font-bold">CSS</span>,{" "}
          <span className="text-cyan-400 font-bold">React</span>, and{" "}
          <span className="text-sky-400 font-bold">Tailwind</span>. I love
          learning, building beautiful user experiences, and always seek new
          challenges in the world of programming and web design.
        </p>
        {/* marquee آیکون‌ها */}
        <div
          className="relative overflow-hidden !w-full h-20 mt-4 bg-[#2d0b4e] rounded-xl border border-[#a259ff] shadow-inner flex items-center !justify-around"
        >
          <img src={htmlImg} alt="HTML" className="w-12 h-12" />
          <img src={cssImg} alt="CSS" className="w-12 h-12" />
          <img src={reactImg} alt="React" className="w-12 h-12" />
          <img src={tailwindImg} alt="Tailwind" className="w-12 h-12" />
          <img src={djangoImg} alt="Django" className="w-12 h-12" />
          <img src={pythonImg} alt="Python" className="w-12 h-12" />
        </div>
      </div>
    </main>
  );
};

export default About;
