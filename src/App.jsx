import React, { useState, useEffect, useRef } from 'react';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const certificationsContainerRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);

  const scrollIntervalRef = useRef(null);

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for user's system preference for dark mode
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDarkMode);

    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollDirectionRef = useRef('forward');
  const scrollPausedRef = useRef(false);

  const startAutomaticScrolling = () => {
    const container = certificationsContainerRef.current;
    if (!container || scrollPausedRef.current) return;

    const scrollSpeed = 1;
    const intervalTime = 20;
    // Ensure certifications array is not empty before querying for card
    const card = container.querySelector('[data-card]');
    // Fallback to a default width if card is not found or has no offsetWidth
    const cardWidth = card?.offsetWidth || 300;
    const gap = 24;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;

    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
    }

    scrollIntervalRef.current = setInterval(() => {
      if (!container) return;

      if (scrollDirectionRef.current === 'forward') {
        container.scrollLeft += scrollSpeed;

        if (container.scrollLeft >= maxScrollLeft) {
          clearInterval(scrollIntervalRef.current);
          scrollIntervalRef.current = null;
          scrollPausedRef.current = true;

          setTimeout(() => {
            scrollDirectionRef.current = 'backward';
            scrollPausedRef.current = false;
            startAutomaticScrolling();
          }, 5000);
        }

      } else {
        container.scrollLeft -= scrollSpeed;

        if (container.scrollLeft <= 0) {
          clearInterval(scrollIntervalRef.current);
          scrollIntervalRef.current = null;
          scrollPausedRef.current = true;

          setTimeout(() => {
            scrollDirectionRef.current = 'forward';
            scrollPausedRef.current = false;
            startAutomaticScrolling();
          }, 5000);
        }
      }
    }, intervalTime);
  };

  const stopAutomaticScrolling = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

  useEffect(() => {
    const container = certificationsContainerRef.current;
    if (!container) return;

    startAutomaticScrolling();

    const handleMouseDown = (e) => {
      stopAutomaticScrolling();
      setIsDragging(true);
      setStartX(e.pageX - container.offsetLeft);
      setScrollLeftStart(container.scrollLeft);
      container.style.cursor = 'grabbing';
    };

    const handleMouseLeave = () => {
      if (isDragging) {
        setIsDragging(false);
        startAutomaticScrolling();
        container.style.cursor = 'grab';
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        startAutomaticScrolling();
        container.style.cursor = 'grab';
      }
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      e.preventDefault(); // Prevent text selection
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX); // How far the mouse has moved
      container.scrollLeft = scrollLeftStart - walk;
    };

    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mousemove', handleMouseMove);

    return () => {
      stopAutomaticScrolling();
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mousemove', handleMouseMove);
      // Remove these redundant event listeners as they are not added in this useEffect
      // container.removeEventListener('mouseenter', stopAutomaticScrolling);
      // container.removeEventListener('mouseleave', startAutomaticScrolling);
    };
  }, [isDragging, startX, scrollLeftStart]);

  const skills = {
    'Web Development': ['HTML5', 'CSS3', 'JavaScript (ES6+)'],
    'Programming': ['Python', 'JavaScript (ES6+)'],
    'Database': ['MySQL'],
    'JavaScript Technologies': ['React', 'Node.js'],
    'Front-End Build Tools': ['Vite', 'PostCSS', 'Autoprefixer'],
    'CSS Framework': ['Bootstrap', 'Tailwind CSS'],
    'Version Control': ['Git', 'GitHub', 'GitLab'],
    'Software & Tools': [
      'Figma',
      'Canva',
      'Microsoft Office Suite',
      'Adobe Photoshop',
      'AutoCAD',
      'SketchUp',
    ],
    'Soft Skills': [
      'Problem-solving',
      'Critical Thinking',
      'Initiative',
      'Adaptability',
      'Time Management',
      'Work Ethic',
      'Patience',
      'Creativity',
      'Innovation',
      'Leadership',
      'Teamwork',
      'Communication'
    ],
  };

  const projects = [
    {
      id: 'project-1',
      category: 'Project 1',
      title: 'Project 1',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      technologies: ['Python', 'HTML', 'CSS', 'JavaScript'],
      imageUrl: 'https://placehold.co/600x400/FFF0F5/800000?text=Project+1',
      link: '#',
    },
    {
      id: 'project-2',
      category: 'Project 2',
      title: 'Project 2',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      technologies: ['Python', 'HTML', 'CSS', 'JavaScript'],
      imageUrl: 'https://placehold.co/600x400/FFF0F5/800000?text=Project+2',
      link: '#',
    },
  ];

  const education = [
    {
      id: 'edu-1',
      degree: 'BS Computer Engineering',
      institution: 'Polytechnic University of the Philippines',
      years: '2021 - 2025',
      description: 'Specialized in Software Development with a focus on web technologies.',
      logoUrl: 'https://placehold.co/100x100/ADD8E6/000000?text=PUP+Logo'
    },
    {
      id: 'edu-2',
      degree: 'BS Interior Design',
      institution: 'Polytechnic University of the Philippines',
      years: '2019 - 2021',
      description: 'My first course in Polytechnic University of the Philippines. Took 2 years of this course before shifting to BS Computer Engineering in 2021.',
      logoUrl: 'https://placehold.co/100x100/FFD700/000000?text=PUP+Logo'
    },
  ];

  const certifications = [
    {
      id: 'cert-1',
      name: 'Certification 1',
      issuer: 'Google (via Coursera)',
      date: 'Month 2023',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      logoUrl: 'https://placehold.co/100x100/4285F4/FFFFFF?text=Google',
      credentialUrl: '#',
      imageUrl: 'https://placehold.co/150x100/4285F4/FFFFFF?text=Certification+1'
    },
    {
      id: 'cert-2',
      name: 'Certification 2',
      issuer: 'Google (via Coursera)',
      date: 'Month 2023',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      logoUrl: 'https://placehold.co/100x100/FFD700/000000?text=UMich',
      credentialUrl: '#',
      imageUrl: 'https://placehold.co/150x100/FFD700/000000?text=Certification+2'
    },
    {
      id: 'cert-3',
      name: 'Certification 3',
      issuer: 'Google (via Coursera)',
      date: 'Month 2023',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      logoUrl: 'https://placehold.co/100x100/3B5998/FFFFFF?text=Meta',
      credentialUrl: '#',
      imageUrl: 'https://placehold.co/150x100/3B5998/FFFFFF?text=Certification+3'
    },
    {
      id: 'cert-4',
      name: 'Certification 4',
      issuer: 'Google (via Coursera)',
      date: 'Month 2023',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      logoUrl: 'https://placehold.co/100x100/006699/FFFFFF?text=IBM',
      credentialUrl: '#',
      imageUrl: 'https://placehold.co/150x100/006699/FFFFFF?text=Certification+4'
    },
    {
      id: 'cert-5',
      name: 'Certification 5',
      issuer: 'Google (via Coursera)',
      date: 'Month 2023',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      logoUrl: 'https://placehold.co/100x100/FF9900/000000?text=AWS',
      credentialUrl: '#',
      imageUrl: 'https://placehold.co/150x100/FF9900/000000?text=Certification+5'
    },
    {
      id: 'cert-6',
      name: 'Certification 6',
      issuer: 'Amazon Web Services (AWS)',
      date: 'June 2025',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      logoUrl: 'https://placehold.co/100x100/0078D4/FFFFFF?text=Azure',
      credentialUrl: '#',
      imageUrl: 'https://placehold.co/150x100/0078D4/FFFFFF?text=Certification+6'
    },
    {
      id: 'cert-7',
      name: 'Certification 7',
      issuer: 'Amazon Web Services (AWS)',
      date: 'June 2025',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      logoUrl: 'https://placehold.co/100x100/F26522/FFFFFF?text=CompTIA',
      credentialUrl: '#',
      imageUrl: 'https://placehold.co/150x100/F26522/FFFFFF?text=Certification+7'
    },
    {
      id: 'cert-8',
      name: 'Certification 8',
      issuer: 'Amazon Web Services (AWS)',
      date: 'June 2025',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      logoUrl: 'https://placehold.co/100x100/0096D6/FFFFFF?text=Scrum',
      credentialUrl: '#',
      imageUrl: 'https://placehold.co/150x100/0096D6/FFFFFF?text=Certification+8'
    },
    {
      id: 'cert-9',
      name: 'Certification 9',
      issuer: 'Amazon Web Services (AWS)',
      date: 'June 2025',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      logoUrl: 'https://placehold.co/100x100/CC0000/FFFFFF?text=PMI',
      credentialUrl: '#',
      imageUrl: 'https://placehold.co/150x100/CC0000/FFFFFF?text=Certification+9'
    },
  ];

  const displayCertifications = certifications;

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  let resumeScrollTimeout = null;

  const pauseAutoScrollTemporarily = () => {
    stopAutomaticScrolling();
    if (resumeScrollTimeout) {
      clearTimeout(resumeScrollTimeout);
    }
    resumeScrollTimeout = setTimeout(() => {
      startAutomaticScrolling();
    }, 5000);
  };

  const scrollCertificationsLeft = () => {
    const container = certificationsContainerRef.current;
    if (!container) return;

    pauseAutoScrollTemporarily();

    const card = container.querySelector('[data-card]');
    const cardWidth = card?.offsetWidth || 300;
    const gap = 24;
    const scrollAmount = cardWidth + gap;

    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  };

  const scrollCertificationsRight = () => {
    const container = certificationsContainerRef.current;
    if (!container) return;

    pauseAutoScrollTemporarily();

    const card = container.querySelector('[data-card]');
    const cardWidth = card?.offsetWidth || 300;
    const gap = 24;
    const scrollAmount = cardWidth + gap;

    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className={`font-sans antialiased transition-colors duration-500 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>

      {/* Header/Navigation Bar */}
      <header className={`fixed w-full z-50 ${isDarkMode ? 'bg-gray-800 shadow-lg' : 'bg-white shadow-md'}`}>
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo/Name */}
          <a href="#" className={`text-2xl font-bold ${isDarkMode ? 'text-indigo-400' : 'text-indigo-700'} rounded-md p-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-indigo-50'} transition duration-300`}>
            Miguel Ivan Calarde
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            <button onClick={() => scrollToSection('projects')} className={`${isDarkMode ? 'text-gray-300 hover:text-indigo-400 hover:bg-gray-700' : 'text-gray-600 hover:text-indigo-700 hover:bg-gray-100'} font-medium transition duration-300 rounded-md px-3 py-2`}>Projects</button>
            <button onClick={() => scrollToSection('skills')} className={`${isDarkMode ? 'text-gray-300 hover:text-indigo-400 hover:bg-gray-700' : 'text-gray-600 hover:text-indigo-700 hover:bg-gray-100'} font-medium transition duration-300 rounded-md px-3 py-2`}>Skills</button>
            <button onClick={() => scrollToSection('education')} className={`${isDarkMode ? 'text-gray-300 hover:text-indigo-400 hover:bg-gray-700' : 'text-gray-600 hover:text-indigo-700 hover:bg-gray-100'} font-medium transition duration-300 rounded-md px-3 py-2`}>Education</button>
            <button onClick={() => scrollToSection('certifications')} className={`${isDarkMode ? 'text-gray-300 hover:text-indigo-400 hover:bg-gray-700' : 'text-gray-600 hover:text-indigo-700 hover:bg-gray-100'} font-medium transition duration-300 rounded-md px-3 py-2`}>Certifications</button>
            <button onClick={() => scrollToSection('about')} className={`${isDarkMode ? 'text-gray-300 hover:text-indigo-400 hover:bg-gray-700' : 'text-gray-600 hover:text-indigo-700 hover:bg-gray-100'} font-medium transition duration-300 rounded-md px-3 py-2`}>About</button>
            <button onClick={() => scrollToSection('github')} className={`${isDarkMode ? 'text-gray-300 hover:text-indigo-400 hover:bg-gray-700' : 'text-gray-600 hover:text-indigo-700 hover:bg-gray-100'} font-medium transition duration-300 rounded-md px-3 py-2`}>GitHub</button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`${isDarkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-700'} focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md p-2`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className={`md:hidden ${isDarkMode ? 'bg-gray-800 shadow-lg' : 'bg-white shadow-lg'} py-2`}>
            <button onClick={() => scrollToSection('projects')} className={`block w-full text-left px-4 py-2 ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>Projects</button>
            <button onClick={() => scrollToSection('skills')} className={`block w-full text-left px-4 py-2 ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>Skills</button>
            <button onClick={() => scrollToSection('education')} className={`block w-full text-left px-4 py-2 ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>Education</button>
            <button onClick={() => scrollToSection('certifications')} className={`block w-full text-left px-4 py-2 ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>Certifications</button>
            <button onClick={() => scrollToSection('about')} className={`block w-full text-left px-4 py-2 ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>About</button>
            <button onClick={() => scrollToSection('github')} className={`block w-full text-left px-4 py-2 ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>GitHub</button>
          </div>
        )}
      </header>

      {/* Intro Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-24 md:py-25 pt-24 pb-14">
        <div className="container mx-auto px-4 text-center pt-10">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 animate-fade-in-up">
            Hello, I'm Miguel <span className="text-green-300">Ivan</span> Calarde
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90 animate-fade-in-up delay-200 pb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <button
            onClick={() => scrollToSection('projects')}
            className="bg-white text-indigo-700 px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-gray-100 transform hover:scale-105 transition duration-300 ease-in-out animate-fade-in-up delay-400"
          >
            View My Work
          </button>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="container mx-auto px-4 py-12 md:py-12 scroll-mt-[96px]">
        <h2 className={`text-3xl md:text-4xl font-bold text-center mb-12 ${isDarkMode ? 'text-white' : 'text-indigo-700'}`}>
          Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
          {projects.map((project) => (
            <div key={project.id} className={`rounded-xl shadow-lg overflow-hidden border-b-4 border-purple-500 hover:shadow-xl transition duration-300 transform hover:-translate-y-1 ${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'}`}>
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-56 object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/600x400/CCCCCC/000000?text=Image+Error`; }}
              />
              <div className="p-6">
                <span className={`text-sm font-semibold px-3 py-1 rounded-full mb-3 inline-block ${isDarkMode ? 'text-purple-300 bg-purple-900' : 'text-purple-600 bg-purple-100'}`}>
                  {project.category}
                </span>
                <h3 className={`text-2xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{project.title}</h3>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed mb-4`}>{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, index) => (
                    <span key={index} className={`${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'} text-xs px-3 py-1 rounded-full`}>
                      {tech}
                    </span>
                  ))}
                </div>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center ${isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'} font-semibold transition duration-300`}
                >
                  Learn More
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className={`py-12 md:py-12 scroll-mt-[96px] ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className="container mx-auto px-4">
          <h2 className={`text-3xl md:text-4xl font-bold text-center mb-12 ${isDarkMode ? 'text-white' : 'text-indigo-700'}`}>
            Skills
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(skills).map(([category, skillList]) => (
              <div key={category} className={`p-6 rounded-xl shadow-lg border-b-4 border-indigo-500 hover:shadow-xl transition duration-300 transform hover:-translate-y-1 ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-800'}`}>
                <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>{category}</h3>
                <ul className="list-disc list-inside space-y-2">
                  {skillList.map((skill, index) => (
                    <li key={index} className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <svg className={`w-4 h-4 mr-2 flex-shrink-0 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-400'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 to 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className={`pt-12 md:pt-12 py-12 md:py-12 scroll-mt-[96px] ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4">
          <h2 className={`text-3xl md:text-4xl font-bold text-center mb-12 ${isDarkMode ? 'text-white' : 'text-indigo-700'}`}>
            Education
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {education.map((edu) => (
              <div key={edu.id} className={`p-6 rounded-xl shadow-lg border-b-4 border-indigo-500 hover:shadow-xl transition duration-300 transform hover:-translate-y-1 flex items-start space-x-4 ${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'}`}>
                <div>
                  <h3 className={`text-xl font-semibold mb-1 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>{edu.degree}</h3>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-lg mb-1`}>{edu.institution}</p>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm mb-3`}>{edu.years}</p>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>{edu.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section id="certifications" className={`mx-auto px-4 py-12 md:py-12 scroll-mt-[96px] ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <h2 className={`text-3xl md:text-4xl font-bold text-center mb-12 ${isDarkMode ? 'text-white' : 'text-indigo-700'}`}>
          Certifications
        </h2>
        <div className="relative flex items-center justify-center shadow-mask">
          <button
            onClick={scrollCertificationsLeft}
            className={`absolute left-4 z-10 p-3 text-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-opacity-75 ${isDarkMode ? 'bg-indigo-700 hover:bg-indigo-600 focus:ring-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'}`}
            aria-label="Scroll left"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>

          {/* Added ref and hide-scrollbar class */}
          <div
            ref={certificationsContainerRef}
            className="flex space-x-6 overflow-x-auto pb-4 scroll-smooth hide-scrollbar py-1 pb-10"
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }} // Change cursor based on dragging state
          >
            {/* Use displayCertifications for duplication */}
            {displayCertifications.map((cert, index) => (
              <div key={`${cert.id}-${index}`} data-card className={`rounded-xl shadow-lg overflow-hidden border-b-4 border-green-500 hover:shadow-xl transition duration-300 transform hover:-translate-y-1 flex flex-col text-center min-w-[300px] ${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'}`}> {/* min-w-[300px] controls card width */}
                <img
                  src={cert.imageUrl}
                  alt={cert.name}
                  className="w-full h-32 object-cover rounded-t-xl"
                  onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/150x100/CCCCCC/000000?text=Cert+Image`; }}
                />
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className={`text-xl font-semibold mb-1 ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>{cert.name}</h3>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-lg mb-1`}>{cert.issuer}</p>
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm mb-3`}>{cert.date}</p>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed mb-3`}>{cert.description}</p>
                  </div>
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center justify-center font-semibold transition duration-300 mt-auto ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                    >
                      View Credential
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={scrollCertificationsRight}
            className={`absolute right-4 z-10 p-3 text-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-opacity-75 ${isDarkMode ? 'bg-indigo-700 hover:bg-indigo-600 focus:ring-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'}`}
            aria-label="Scroll right"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={`container mx-auto px-4 py-12 md:py-12 scroll-mt-[96px] ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
        <div className={`max-w-3xl mx-auto p-8 md:p-10 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-3xl md:text-4xl font-bold text-center mb-8 ${isDarkMode ? 'text-white' : 'text-indigo-700'}`}>
            About Me
          </h2>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed mb-4`}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed mb-4`}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>
      </section>

      {/* GitHub Section */}
      <section id="github" className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 md:py-12 scroll-mt-[96px]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Check out my GitHub!
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Feel free to check my projects on my GitHub account.
          </p>
          <div className="flex flex-col items-center space-y-4">
            <a
              href="https://github.com/vnclrd"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-gray-800 px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-gray-100 transform hover:scale-105 transition duration-300 ease-in-out">
              Visit GitHub
            </a>
          </div>
        </div>
      </section>
      
      {/* Dark Mode Toggle Button */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className={`fixed bottom-4 left-4 z-50 px-4 py-2 rounded-full shadow-lg focus:outline-none focus:ring-2 transition ${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600 focus:ring-gray-500' : 'bg-gray-800 text-white hover:bg-gray-700 focus:ring-gray-500'}`}
      >
        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
      </button>

      {/* Floating Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`
          fixed bottom-4 right-4 bg-indigo-600 text-white p-3 rounded-full shadow-lg
          hover:bg-indigo-700 transition-opacity duration-500 z-50
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75
          ${showScrollToTop ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        aria-label="Scroll to top"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
        </svg>
      </button>

      {/* Footer */}
      <footer className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-800'} text-white py-8`}>
        <div className="container mx-auto px-4 text-center text-sm">
          &copy; {new Date().getFullYear()} Miguel Ivan Calarde. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default App;