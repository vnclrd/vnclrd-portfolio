import React, { useState, useEffect, useRef } from 'react';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const projectsContainerRef = useRef(null);
  const certificationsContainerRef = useRef(null);
  const otherWorkExperienceRef = useRef(null); // Renamed from otherWorkExperienceRef to otherWorksContainerRef for consistency

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);

  // Refs for Projects carousel automatic scrolling
  const projectScrollIntervalRef = useRef(null);
  const projectScrollDirectionRef = useRef('forward'); // 'forward' or 'backward'
  const projectScrollPausedRef = useRef(false); // To temporarily pause auto-scroll (e.e., on manual scroll)

  // Refs for Certifications carousel automatic scrolling
  const certScrollIntervalRef = useRef(null);
  const certScrollDirectionRef = useRef('forward'); // 'forward' or 'backward'
  const certScrollPausedRef = useRef(false); // To temporarily pause auto-scroll (e.g., on manual scroll)

  // Refs for Other Work Experience carousel automatic scrolling
  const otherWorkScrollIntervalRef = useRef(null);
  const otherWorkScrollDirectionRef = useRef('forward'); // 'forward' or 'backward'
  const otherWorkScrollPausedRef = useRef(false); // To temporarily pause auto-scroll (e.g., on manual scroll)


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

  // --- Certifications Carousel Logic ---
  const startCertAutomaticScrolling = () => {
    const container = certificationsContainerRef.current;
    if (!container || certScrollPausedRef.current) return;

    const scrollSpeed = 1; // Speed of the scroll
    const intervalTime = 20; // Interval for updating scroll position
    const card = container.querySelector('[data-cert-card]');
    const cardWidth = card?.offsetWidth || 300; // Default width if card not found
    const gap = 24; // Gap between cards
    const maxScrollLeft = container.scrollWidth - container.clientWidth; // Max scrollable distance

    // Clear any existing interval to prevent multiple intervals running
    if (certScrollIntervalRef.current) {
      clearInterval(certScrollIntervalRef.current);
    }

    certScrollIntervalRef.current = setInterval(() => {
      if (!container) return; // Exit if container is no longer available

      if (certScrollDirectionRef.current === 'forward') {
        container.scrollLeft += scrollSpeed;

        // If scrolled to the end, reverse direction and set a pause
        if (container.scrollLeft >= maxScrollLeft) {
          clearInterval(certScrollIntervalRef.current); // Stop current interval
          certScrollIntervalRef.current = null;
          certScrollPausedRef.current = true; // Pause auto-scroll

          // After a delay, reverse direction and restart auto-scroll
          setTimeout(() => {
            certScrollDirectionRef.current = 'backward';
            certScrollPausedRef.current = false;
            startCertAutomaticScrolling();
          }, 5000); // 5 seconds pause
        }

      } else { // Scrolling backward
        container.scrollLeft -= scrollSpeed;

        // If scrolled to the beginning, reverse direction and set a pause
        if (container.scrollLeft <= 0) {
          clearInterval(certScrollIntervalRef.current); // Stop current interval
          certScrollIntervalRef.current = null;
          certScrollPausedRef.current = true; // Pause auto-scroll

          // After a delay, reverse direction and restart auto-scroll
          setTimeout(() => {
            certScrollDirectionRef.current = 'forward';
            certScrollPausedRef.current = false;
            startCertAutomaticScrolling();
          }, 5000); // 5 seconds pause
        }
      }
    }, intervalTime);
  };

  const stopCertAutomaticScrolling = () => {
    if (certScrollIntervalRef.current) {
      clearInterval(certScrollIntervalRef.current);
      certScrollIntervalRef.current = null;
    }
  };

  let certResumeScrollTimeout = null;
  const pauseCertAutoScrollTemporarily = () => {
    stopCertAutomaticScrolling();
    if (certResumeScrollTimeout) {
      clearTimeout(certResumeScrollTimeout);
    }
    certResumeScrollTimeout = setTimeout(() => {
      startCertAutomaticScrolling();
    }, 5000);
  };

  const scrollCertificationsLeft = () => {
    const container = certificationsContainerRef.current;
    if (!container) return;

    if (container.scrollLeft === 0) { // If already at the beginning, do not scroll
      return;
    }

    pauseCertAutoScrollTemporarily(); // Pause auto-scroll briefly on manual interaction

    const card = container.querySelector('[data-cert-card]');
    const cardWidth = card?.offsetWidth || 300;
    const gap = 24;
    const scrollAmount = cardWidth + gap;
    const isMobile = window.innerWidth < 768; // Check if on mobile

    container.scrollBy({ left: -scrollAmount, behavior: isMobile ? 'auto' : 'smooth' });
  };

  const scrollCertificationsRight = () => {
    const container = certificationsContainerRef.current;
    if (!container) return;

    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    if (container.scrollLeft >= maxScrollLeft) { // If already at the end, do not scroll
      return;
    }

    pauseCertAutoScrollTemporarily(); // Pause auto-scroll briefly on manual interaction

    const card = container.querySelector('[data-cert-card]');
    const cardWidth = card?.offsetWidth || 300;
    const gap = 24;
    const scrollAmount = cardWidth + gap;
    const isMobile = window.innerWidth < 768; // Check if on mobile

    container.scrollBy({ left: scrollAmount, behavior: isMobile ? 'auto' : 'smooth' });
  };


  // --- Projects Carousel Logic ---
  const startProjectAutomaticScrolling = () => {
    const container = projectsContainerRef.current;
    if (!container || projectScrollPausedRef.current) return;

    const scrollSpeed = 1; // Speed of the scroll
    const intervalTime = 20; // Interval for updating scroll position
    const card = container.querySelector('[data-project-card]');
    const cardWidth = card?.offsetWidth || 350;
    const gap = 24;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;

    // Clear any existing interval
    if (projectScrollIntervalRef.current) {
      clearInterval(projectScrollIntervalRef.current);
    }

    projectScrollIntervalRef.current = setInterval(() => {
      if (!container) return;

      if (projectScrollDirectionRef.current === 'forward') {
        container.scrollLeft += scrollSpeed;

        // If scrolled to the end, reverse direction and set a pause
        if (container.scrollLeft >= maxScrollLeft) {
          clearInterval(projectScrollIntervalRef.current);
          projectScrollIntervalRef.current = null;
          projectScrollPausedRef.current = true;

          setTimeout(() => {
            projectScrollDirectionRef.current = 'backward';
            projectScrollPausedRef.current = false;
            startProjectAutomaticScrolling();
          }, 5000); // 5 seconds pause
        }

      } else { // Scrolling backward
        container.scrollLeft -= scrollSpeed;

        // If scrolled to the beginning, reverse direction and set a pause
        if (container.scrollLeft <= 0) {
          clearInterval(projectScrollIntervalRef.current);
          projectScrollIntervalRef.current = null;
          projectScrollPausedRef.current = true;

          setTimeout(() => {
            projectScrollDirectionRef.current = 'forward';
            projectScrollPausedRef.current = false;
            startProjectAutomaticScrolling();
          }, 5000); // 5 seconds pause
        }
      }
    }, intervalTime);
  };

  const stopProjectAutomaticScrolling = () => {
    if (projectScrollIntervalRef.current) {
      clearInterval(projectScrollIntervalRef.current);
      projectScrollIntervalRef.current = null;
    }
  };

  let projectResumeScrollTimeout = null;
  const pauseProjectAutoScrollTemporarily = () => {
    stopProjectAutomaticScrolling();
    if (projectResumeScrollTimeout) {
      clearTimeout(projectResumeScrollTimeout);
    }
    projectResumeScrollTimeout = setTimeout(() => {
      startProjectAutomaticScrolling();
    }, 5000);
  };

  const scrollProjectsLeft = () => {
    const container = projectsContainerRef.current;
    if (!container) return;

    if (container.scrollLeft === 0) { // If already at the beginning, do not scroll
      return;
    }

    pauseProjectAutoScrollTemporarily(); // Pause auto-scroll briefly on manual interaction

    const card = container.querySelector('[data-project-card]');
    const cardWidth = card?.offsetWidth || 350;
    const gap = 24;
    const scrollAmount = cardWidth + gap;
    const isMobile = window.innerWidth < 768; // Check if on mobile

    container.scrollBy({ left: -scrollAmount, behavior: isMobile ? 'auto' : 'smooth' });
  };

  const scrollProjectsRight = () => {
    const container = projectsContainerRef.current;
    if (!container) return;

    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    if (container.scrollLeft >= maxScrollLeft) { // If already at the end, do not scroll
      return;
    }

    pauseProjectAutoScrollTemporarily(); // Pause auto-scroll briefly on manual interaction

    const card = container.querySelector('[data-project-card]');
    const cardWidth = card?.offsetWidth || 350;
    const gap = 24;
    const scrollAmount = cardWidth + gap;
    const isMobile = window.innerWidth < 768; // Check if on mobile

    container.scrollBy({ left: scrollAmount, behavior: isMobile ? 'auto' : 'smooth' });
  };

  // --- Other Work Experience Carousel Logic ---
  const startOtherWorkAutomaticScrolling = () => {
    const container = otherWorkExperienceRef.current;
    if (!container || otherWorkScrollPausedRef.current) return;

    const scrollSpeed = 1; // Speed of the scroll
    const intervalTime = 20; // Interval for updating scroll position
    const card = container.querySelector('[data-other-card]');
    const cardWidth = card?.offsetWidth || 300;
    const gap = 24;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;

    if (otherWorkScrollIntervalRef.current) {
      clearInterval(otherWorkScrollIntervalRef.current);
    }

    otherWorkScrollIntervalRef.current = setInterval(() => {
      if (!container) return;

      if (otherWorkScrollDirectionRef.current === 'forward') {
        container.scrollLeft += scrollSpeed;

        if (container.scrollLeft >= maxScrollLeft) {
          clearInterval(otherWorkScrollIntervalRef.current);
          otherWorkScrollIntervalRef.current = null;
          otherWorkScrollPausedRef.current = true;

          setTimeout(() => {
            otherWorkScrollDirectionRef.current = 'backward';
            otherWorkScrollPausedRef.current = false;
            startOtherWorkAutomaticScrolling();
          }, 5000);
        }

      } else { // Scrolling backward
        container.scrollLeft -= scrollSpeed;

        if (container.scrollLeft <= 0) {
          clearInterval(otherWorkScrollIntervalRef.current);
          otherWorkScrollIntervalRef.current = null;
          otherWorkScrollPausedRef.current = true;

          setTimeout(() => {
            otherWorkScrollDirectionRef.current = 'forward';
            otherWorkScrollPausedRef.current = false;
            startOtherWorkAutomaticScrolling();
          }, 5000);
        }
      }
    }, intervalTime);
  };

  const stopOtherWorkAutomaticScrolling = () => {
    if (otherWorkScrollIntervalRef.current) {
      clearInterval(otherWorkScrollIntervalRef.current);
      otherWorkScrollIntervalRef.current = null;
    }
  };

  let otherWorkResumeScrollTimeout = null;
  const pauseOtherWorkAutoScrollTemporarily = () => {
    stopOtherWorkAutomaticScrolling();
    if (otherWorkResumeScrollTimeout) {
      clearTimeout(otherWorkResumeScrollTimeout);
    }
    otherWorkResumeScrollTimeout = setTimeout(() => {
      startOtherWorkAutomaticScrolling();
    }, 5000);
  };


  // Unified mouse drag handling for all carousels
  const handleMouseDown = (e, containerRef, startAutoScrollFn, stopAutoScrollFn) => {
    const container = containerRef.current;
    if (!container) return;

    stopAutoScrollFn(); // Stop automatic scrolling for the specific carousel
    setIsDragging(true);
    setStartX(e.pageX - container.offsetLeft);
    setScrollLeftStart(container.scrollLeft);
  };

  const handleMouseLeave = (containerRef, startAutoScrollFn) => {
    const container = containerRef.current;
    if (!container) return;

    if (isDragging) {
      setIsDragging(false);
      startAutoScrollFn(); // Resume automatic scrolling for the specific carousel
    }
  };

  const handleMouseUp = (containerRef, startAutoScrollFn) => {
    const container = containerRef.current;
    if (!container) return;

    if (isDragging) {
      setIsDragging(false);
      startAutoScrollFn(); // Resume automatic scrolling for the specific carousel
      container.style.cursor = 'grab';
    }
  };

  const handleMouseMove = (e, containerRef) => {
    const container = containerRef.current;
    if (!container || !isDragging) return;

    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX);
    container.scrollLeft = scrollLeftStart - walk;
  };

  const scrollOtherWorksLeft = () => {
    const container = otherWorkExperienceRef.current;
    if (!container) return;

    if (container.scrollLeft === 0) { // If already at the beginning, do not scroll
      return;
    }

    pauseOtherWorkAutoScrollTemporarily(); // Pause auto-scroll briefly on manual interaction

    const card = container.querySelector('[data-other-card]');
    const cardWidth = card?.offsetWidth || 300;
    const gap = 24;
    const scrollAmount = cardWidth + gap;
    const isMobile = window.innerWidth < 768; // Check if on mobile

    container.scrollBy({ left: -scrollAmount, behavior: isMobile ? 'auto' : 'smooth' });
  };

  const scrollOtherWorksRight = () => {
    const container = otherWorkExperienceRef.current;
    if (!container) return;

    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    if (container.scrollLeft >= maxScrollLeft) { // If already at the end, do not scroll
      return;
    }

    pauseOtherWorkAutoScrollTemporarily(); // Pause auto-scroll briefly on manual interaction

    const card = container.querySelector('[data-other-card]');
    const cardWidth = card?.offsetWidth || 300;
    const gap = 24;
    const scrollAmount = cardWidth + gap;
    const isMobile = window.innerWidth < 768; // Check if on mobile

    container.scrollBy({ left: scrollAmount, behavior: isMobile ? 'auto' : 'smooth' });
  };

  // Effect for Certifications Carousel
  useEffect(() => {
    const container = certificationsContainerRef.current;
    if (!container) return;

    startCertAutomaticScrolling(); // Start automatic scrolling

    // Event listeners for dragging
    const mouseDownCert = (e) => handleMouseDown(e, certificationsContainerRef, startCertAutomaticScrolling, stopCertAutomaticScrolling);
    const mouseLeaveCert = () => handleMouseLeave(certificationsContainerRef, startCertAutomaticScrolling);
    const mouseUpCert = () => handleMouseUp(certificationsContainerRef, startCertAutomaticScrolling);
    const mouseMoveCert = (e) => handleMouseMove(e, certificationsContainerRef);

    container.addEventListener('mousedown', mouseDownCert);
    container.addEventListener('mouseleave', mouseLeaveCert);
    container.addEventListener('mouseup', mouseUpCert);
    container.addEventListener('mousemove', mouseMoveCert);

    return () => {
      stopCertAutomaticScrolling(); // Cleanup on unmount
      container.removeEventListener('mousedown', mouseDownCert);
      container.removeEventListener('mouseleave', mouseLeaveCert);
      container.removeEventListener('mouseup', mouseMoveCert);
      container.removeEventListener('mousemove', mouseMoveCert);
    };
  }, [isDragging, startX, scrollLeftStart]); // Depend on dragging state for consistent behavior

  // Effect for Projects Carousel
  useEffect(() => {
    const container = projectsContainerRef.current;
    if (!container) return;

    startProjectAutomaticScrolling(); // Start automatic scrolling

    // Event listeners for dragging
    const mouseDownProject = (e) => handleMouseDown(e, projectsContainerRef, startProjectAutomaticScrolling, stopProjectAutomaticScrolling);
    const mouseLeaveProject = () => handleMouseLeave(projectsContainerRef, startProjectAutomaticScrolling);
    const mouseUpProject = () => handleMouseUp(projectsContainerRef, startProjectAutomaticScrolling);
    const mouseMoveProject = (e) => handleMouseMove(e, projectsContainerRef);

    container.addEventListener('mousedown', mouseDownProject);
    container.addEventListener('mouseleave', mouseLeaveProject);
    container.addEventListener('mouseup', mouseUpProject);
    container.addEventListener('mousemove', mouseMoveProject);

    return () => {
      stopProjectAutomaticScrolling(); // Cleanup on unmount
      container.removeEventListener('mousedown', mouseDownProject);
      container.removeEventListener('mouseleave', mouseLeaveProject);
      container.removeEventListener('mouseup', mouseUpProject);
      container.removeEventListener('mousemove', mouseMoveProject);
    };
  }, [isDragging, startX, scrollLeftStart]); // Depend on dragging state

  // Effect for Other Work Experience Carousel
  useEffect(() => {
    const container = otherWorkExperienceRef.current;
    if (!container) return;

    startOtherWorkAutomaticScrolling(); // Start automatic scrolling

    // Event listeners for dragging
    const mouseDownOtherWork = (e) => handleMouseDown(e, otherWorkExperienceRef, startOtherWorkAutomaticScrolling, stopOtherWorkAutomaticScrolling);
    const mouseLeaveOtherWork = () => handleMouseLeave(otherWorkExperienceRef, startOtherWorkAutomaticScrolling);
    const mouseUpOtherWork = () => handleMouseUp(otherWorkExperienceRef, startOtherWorkAutomaticScrolling);
    const mouseMoveOtherWork = (e) => handleMouseMove(e, otherWorkExperienceRef);

    container.addEventListener('mousedown', mouseDownOtherWork);
    container.addEventListener('mouseleave', mouseLeaveOtherWork);
    container.addEventListener('mouseup', mouseUpOtherWork);
    container.addEventListener('mousemove', mouseMoveOtherWork);

    return () => {
      stopOtherWorkAutomaticScrolling(); // Cleanup on unmount
      container.removeEventListener('mousedown', mouseDownOtherWork);
      container.removeEventListener('mouseleave', mouseLeaveOtherWork);
      container.removeEventListener('mouseup', mouseUpOtherWork);
      container.removeEventListener('mousemove', mouseMoveOtherWork);
    };
  }, [isDragging, startX, scrollLeftStart]);


  const skills = {
    'Web Development': ['HTML5', 'CSS3', 'JavaScript (ES6+)'],
    'Programming': ['Python (Flask)', 'JavaScript (ES6+)'],
    'Database': ['MySQL'],
    'JavaScript Technologies': ['React', 'Node.js'],
    'Front-End Build Tools': ['Vite', 'PostCSS', 'Autoprefixer'],
    'CSS Framework': ['Bootstrap', 'Tailwind CSS'],
    'Version Control': ['Git', 'GitHub', 'GitLab'],
    'Software & Tools': [
      'Visual Studio Code',
      'Arduino IDE',
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
      category: 'Web Development',
      title: 'InstaPrint Web UI',
      description: 'InstaPrint is a printing solution that helps address the need for a more convenient and efficient way of printing while having a user-friendly interface designed to make the device easier.',
      technologies: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'Python (Flask)', 'MySQL', 'Bootstrap', 'Arduino IDE'],
      imageUrl: 'images/proj-1.webp',
      link: '#',
    },
    {
      id: 'project-2',
      category: 'Mobile App Development',
      title: 'ShouldU',
      description: 'ShouldU is a simple and straightforward application that helps you make up your mind on something you want to do. It summarizes all related information that you give to the application with simple questions that can be easily answered.',
      technologies: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'Apache Cordova'],
      imageUrl: 'images/proj-2.webp',
      link: '#',
    },
    {
      id: 'project-3',
      category: 'Web Development',
      title: 'Portfolio Website',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      technologies: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'React', 'Node.js', 'Vite', 'PostCSS', 'Autoprefixer', 'Tailwind CSS'],
      imageUrl: 'https://placehold.co/600x400/FFF0F5/800000?text=Portfolio+Website',
      link: '#',
    },
    {
      id: 'project-4',
      category: 'Category 1',
      title: 'Project 4',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      technologies: ['', '', ''],
      imageUrl: 'https://placehold.co/600x400/FFF0F5/800000?text=Project+4',
      link: '#',
    },
  ];

  const displayProjects = projects;

  const workExperience = [
    {
      id: 'work-1',
      title: 'Department Team Leader, Full Stack WordPress Developer Intern',
      company: 'ROC.PH Digital Marketing Services',
      years: 'June 2024 - October 2024',
      description: 'Earned commendation for leadership and key contributions as Department Team Leader, starting from Full Stack WordPress Developer role. Reported directly to the CEO on team performance, milestones, and challenges and worked with cross-functional teams to deliver integrated web solutions.'
    },
    {
      id: 'work-2',
      title: 'Front-End Web Developer Intern',
      company: 'LexMeet, Inc.',
      years: 'June 2023 - October 2024',
      description: 'Developed and designed user-facing features, applying logical reasoning to effectively solve problems, while consistently demonstrating initiative, a strong work ethic, and timely task completion; throughout the role, was trusted with confidential information and remained resilient and reliable, particularly in high-pressure and critical situations.'
    }
  ];

  const otherWorks = [
    {
      id: 'other-1',
      title: 'Personal Blog Site',
      company: 'Self-Employed',
      years: '2023',
      description: 'Developed and maintained a personal blog site to share articles on web development and technology. Implemented features like article categorization, search, and comment section.',
    },
    {
      id: 'other-2',
      title: 'E-commerce Redesign Concept',
      company: 'Freelance Project',
      years: '2022',
      description: 'Created a UI/UX redesign concept for an existing e-commerce platform, focusing on improving user flow and visual aesthetics. Utilized Figma for prototyping and wireframing.',
    },
    {
      id: 'other-3',
      title: 'Local Business Website',
      company: 'Volunteer Work',
      years: '2021',
      description: 'Designed and developed a simple informational website for a local non-profit organization to establish their online presence and provide contact information to the community.',
    },
    {
      id: 'other-4',
      title: 'Mobile Game Prototype',
      company: 'Personal Project',
      years: '2020',
      description: 'Developed a basic mobile game prototype using Unity, focusing on core gameplay mechanics and simple UI. Explored game design principles and C# scripting.',
    },
    {
      id: 'other-5',
      title: 'Data Analysis Script',
      company: 'Academic Project',
      years: '2020',
      description: 'Wrote Python scripts to analyze a large dataset for a university project, performing data cleaning, transformation, and visualization to extract meaningful insights.',
    },
    {
      id: 'other-6',
      title: 'Smart Home Automation Concept',
      company: 'Concept Design',
      years: '2019',
      description: 'Explored concepts for a smart home automation system, including device integration, user interface design, and potential security considerations. Created mockups and flowcharts.',
    },
  ];

  const education = [
    {
      id: 'edu-1',
      degree: 'BS Computer Engineering',
      institution: 'Polytechnic University of the Philippines',
      years: '2021 - 2025',
      description: 'Specialized in Software Development with a focus on web technologies.',
    },
    {
      id: 'edu-2',
      degree: 'BS Interior Design',
      institution: 'Polytechnic University of the Philippines',
      years: '2019 - 2021',
      description: 'My first course in Polytechnic University of the Philippines. Took 2 years of this course before shifting to BS Computer Engineering in 2021.',
    },
  ];

  const certifications = [
    {
      id: 'cert-1',
      name: 'Foundations of User Experience (UX) Design',
      issuer: 'Google (via Coursera)',
      date: 'Month 2023',
      description: 'Introduces the core concepts of UX design and the design process, emphasizing user-centered design and accessibility. It prepares learners for entry-level UX design roles by covering topics like user research, wireframing, prototyping, and testing.',
      credentialUrl: 'https://coursera.org/share/397318c8ef04f3d78f79e2dc79d417cb',
      imageUrl: 'images/cert-1.webp'
    },
    {
      id: 'cert-2',
      name: 'The Bits and Bytes of Computer Networking',
      issuer: 'Google (via Coursera)',
      date: 'Month 2023',
      description: 'A course designed to provide a comprehensive overview of computer networking. It covers fundamental concepts of modern networking technologies and protocols, including cloud computing and practical applications for IT professionals.',
      credentialUrl: 'https://coursera.org/share/3de7f88ecd9e24321cae729a45f5c8ff',
      imageUrl: 'images/cert-2.webp'
    },
    {
      id: 'cert-3',
      name: 'Operating Systems and You: Becoming a Power User',
      issuer: 'Google (via Coursera)',
      date: 'Month 2023',
      description: 'A course focused on building a foundational understanding of operating systems. The course covers core OS concepts, including hardware and software management, user administration, and file system navigation, primarily using examples from Windows and Linux. ',
      credentialUrl: 'https://coursera.org/share/d0720fb588988c944b6420cecd3c8bad',
      imageUrl: 'images/cert-3.webp'
    },
    {
      id: 'cert-4',
      name: 'System Administration and IT Infrastructure Services',
      issuer: 'Google (via Coursera)',
      date: 'Month 2023',
      description: 'Encompass the technical maintenance, refinement, and smooth running of computer systems and networks within an organization, ensuring they function effectively and safely. This includes managing servers, cloud resources, user information, and productivity, as well as disaster recovery planning.',
      credentialUrl: 'https://coursera.org/share/7a625b42aac4a37b7ea962fa41b18823',
      imageUrl: 'images/cert-4.webp'
    },
    {
      id: 'cert-5',
      name: 'Technical Support Fundamentals',
      issuer: 'Google (via Coursera)',
      date: 'Month 2023',
      description: 'Introduced to the world of Information Technology, or IT. Learn about the different facets of Information Technology, like computer hardware, the Internet, computer software, troubleshooting, and customer service.',
      credentialUrl: 'https://coursera.org/share/21a31c27ddac9b76446edd246ad43e4a',
      imageUrl: 'images/cert-5.webp'
    },
    {
      id: 'cert-6',
      name: 'Introduction to Database Migration',
      issuer: 'Amazon Web Services (AWS)',
      date: 'June 2025',
      description: 'Learn how to migrate a production database using the AWS Database Migration Service (AWS DMS) and AWS Schema Conversion Tool (AWS SCT). Be introduced to the full database migration process, from envisioning to post-production support.',
      imageUrl: 'images/cert-6.webp'
    },
    {
      id: 'cert-7',
      name: 'Amazon RDS for MariaDB Getting Started',
      issuer: 'Amazon Web Services (AWS)',
      date: 'June 2025',
      description: 'Learn the benefits and technical concepts of Amazon RDS for MariaDB. If you are new to the service, learn how to start using Amazon RDS for MariaDB through a demonstration using the AWS Management Console.',
      imageUrl: 'images/cert-7.webp'
    },
    {
      id: 'cert-8',
      name: 'Introduction to Responsible AI',
      issuer: 'Amazon Web Services (AWS)',
      date: 'June 2025',
      description: 'This course provides an overview of what responsible AI is and why it is important in the context of generative AI. Responsible AI refers to the development, deployment, and use of AI in an ethical, transparent, fair, and accountable manner.',
      imageUrl: 'images/cert-8.webp'
    },
    {
      id: 'cert-9',
      name: 'Getting Started with DevOps on AWS',
      issuer: 'Amazon Web Services (AWS)',
      date: 'June 2025',
      description: 'This beginner-level course is for technical learners in the development and operations domains who are interested in learning the basic concepts of DevOps on AWS. Using discussions, interactive content, and demonstrations, you will learn about culture, practices, and tools used in a DevOps environment. ',
      imageUrl: 'images/cert-9.webp'
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

  return (
    <div className={`font-sans antialiased transition-colors duration-500 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>

      {/* Header/Navigation Bar */}
      <header className={`fixed w-full z-50 ${isDarkMode ? 'bg-gray-800 shadow-lg' : 'bg-white shadow-md'}`}>
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo/Name */}
          <button onClick={scrollToTop} className={`text-2xl font-bold ${isDarkMode ? 'text-indigo-400' : 'text-indigo-700'} rounded-md p-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-indigo-50'} transition duration-300`}>
            Miguel Ivan Calarde
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            <button onClick={() => scrollToSection('projects')} className={`${isDarkMode ? 'text-gray-300 hover:text-indigo-400 hover:bg-gray-700' : 'text-gray-600 hover:text-indigo-700 hover:bg-gray-100'} font-medium transition duration-300 rounded-md px-3 py-2`}>Projects</button>
            <button onClick={() => scrollToSection('work-experience')} className={`${isDarkMode ? 'text-gray-300 hover:text-indigo-400 hover:bg-gray-700' : 'text-gray-600 hover:text-indigo-700 hover:bg-gray-100'} font-medium transition duration-300 rounded-md px-3 py-2`}>Work Experience</button>
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
            <button onClick={() => scrollToSection('work-experience')} className={`block w-full text-left px-4 py-2 ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>Work Experience</button>
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
        {/* Container for the entire intro content */}
        <div className="container mx-auto px-4 pt-10 flex flex-col md:flex-row items-center justify-center">
          {/* Image holder */}
          <div className="mb-8 md:mb-0 md:mr-8 flex-shrink-0">
            <img
              src="https://placehold.co/200x200/FFFFFF/000000?text=Profile" // Placeholder image
              alt="Profile Picture"
              className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-lg"
            />
          </div>
          {/* Text content */}
          <div className="text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 animate-fade-in-up">
              Hello, I'm Miguel <span className="text-green-300">Ivan</span> Calarde
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90 animate-fade-in-up delay-200 pb-4">
              A graduating Computer Engineer student who specializes in System Development with practical experience in Front-End and Back-End Web Development.
            </p>
            <button
              onClick={() => scrollToSection('about')}
              className="bg-white text-indigo-700 px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-gray-100 transform hover:scale-105 transition duration-300 ease-in-out animate-fade-in-up delay-400"
            >
              More About Me
            </button>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="mx-auto px-4 py-12 md:py-12 scroll-mt-[96px]">
        <h2 className={`text-3xl md:text-4xl font-bold text-center mb-12 ${isDarkMode ? 'text-white' : 'text-indigo-700'}`}>
          Projects
        </h2>
        <div className="relative flex items-center justify-center shadow-mask">
          <button
            onClick={scrollProjectsLeft}
            className={`absolute left-0 z-10 h-full w-40 flex items-center justify-center text-white rounded-r-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-opacity-75 ${isDarkMode ? 'bg-indigo-700 hover:bg-indigo-600 focus:ring-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'} opacity-0`}
            aria-label="Scroll left"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>

          {/* Projects Carousel Container */}
          <div
            ref={projectsContainerRef}
            className="projects-carousel flex space-x-6 overflow-x-auto pb-4 scroll-smooth hide-scrollbar py-1 pb-10"
          >
            {displayProjects.map((project, index) => (
              <div key={`${project.id}-${index}`} data-project-card className={`rounded-xl shadow-lg overflow-hidden border-b-4 border-purple-500 hover:shadow-xl transition duration-300 transform hover:-translate-y-1 flex flex-col min-w-[350px] md:min-w-[400px] lg:min-w-[450px] ${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'}`}>
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-56 object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/600x400/CCCCCC/000000?text=Image+Error`; }}
                />
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <span className={`text-sm font-semibold px-3 py-1 rounded-full mb-3 inline-block ${isDarkMode ? 'text-purple-300 bg-purple-900' : 'text-purple-600 bg-purple-100'}`}>
                      {project.category}
                    </span>
                    <h3 className={`text-2xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{project.title}</h3>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed mb-4`}>{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech, techIndex) => (
                        <span key={techIndex} className={`${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'} text-xs px-3 py-1 rounded-full`}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center ${isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'} font-semibold transition duration-300 mt-auto`}
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

          <button
            onClick={scrollProjectsRight}
            className={`absolute right-0 z-10 h-full w-40 flex items-center justify-center text-white rounded-l-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-opacity-75 ${isDarkMode ? 'bg-indigo-700 hover:bg-indigo-600 focus:ring-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'} opacity-0`}
            aria-label="Scroll right"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </section>

      {/* Work Experience Section */}
      <section id="work-experience" className={`py-12 md:py-12 scroll-mt-[96px] ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className="container mx-auto px-4">
          <h2 className={`text-3xl md:text-4xl font-bold text-center mb-12 ${isDarkMode ? 'text-white' : 'text-indigo-700'}`}>
            Work Experience
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {workExperience.map((job) => (
              <div key={job.id} className={`p-6 rounded-xl shadow-lg border-b-4 border-teal-500 hover:shadow-xl transition duration-300 transform hover:-translate-y-1 ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-800'}`}>
                <h3 className={`text-xl font-semibold mb-1 ${isDarkMode ? 'text-teal-400' : 'text-teal-600'}`}>{job.title}</h3>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-lg mb-1`}>{job.company}</p>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm mb-3`}>{job.years}</p>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>{job.description}</p>
              </div>
            ))}
          </div>

          {/* Other Work Experience Section - Now a carousel */}
          <div className={`py-12 md:py-12`}>
            <h2 className={`text-3xl md:text-4xl font-bold text-center mb-12 ${isDarkMode ? 'text-white' : 'text-indigo-700'}`}>
              Other Work Experience
            </h2>
            <div className="relative flex items-center justify-center shadow-mask">
              <button
                onClick={scrollOtherWorksLeft}
                className={`absolute left-0 z-10 h-full w-40 flex items-center justify-center text-white rounded-r-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-opacity-75 ${isDarkMode ? 'bg-indigo-700 hover:bg-indigo-600 focus:ring-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'} opacity-0`}
                aria-label="Scroll left"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>

              <div
                ref={otherWorkExperienceRef}
                className="other-works-carousel flex space-x-6 overflow-x-auto pb-4 scroll-smooth hide-scrollbar py-1 pb-10"
              >
                {otherWorks.map((work, index) => (
                  <div key={`${work.id}-${index}`} data-other-card className={`rounded-xl shadow-lg overflow-hidden border-b-4 border-orange-500 hover:shadow-xl transition duration-300 transform hover:-translate-y-1 flex flex-col min-w-[300px] md:min-w-[350px] lg:min-w-[400px] ${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'}`}>
                    <div className="p-6 flex-grow flex flex-col justify-start">
                      <h3 className={`text-xl font-semibold mb-1 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>{work.title}</h3>
                      <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-lg mb-1`}>{work.company}</p>
                      <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm mb-3`}>{work.years}</p>
                      <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed text-sm`}>{work.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={scrollOtherWorksRight}
                className={`absolute right-0 z-10 h-full w-40 flex items-center justify-center text-white rounded-l-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-opacity-75 ${isDarkMode ? 'bg-indigo-700 hover:bg-indigo-600 focus:ring-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'} opacity-0`}
                aria-label="Scroll right"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className={`py-12 md:py-12 scroll-mt-[96px] ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4">
          <h2 className={`text-3xl md:text-4xl font-bold text-center mb-12 ${isDarkMode ? 'text-white' : 'text-indigo-700'}`}>
            Skills
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(skills).map(([category, skillList]) => (
              <div key={category} className={`p-6 rounded-xl shadow-lg border-b-4 border-indigo-500 hover:shadow-xl transition duration-300 transform hover:-translate-y-1 ${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'}`}>
                <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>{category}</h3>
                <ul className="list-disc list-inside space-y-2">
                  {skillList.map((skill, index) => (
                    <li key={index} className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <svg className={`w-4 h-4 mr-2 flex-shrink-0 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-400'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 to 00-1.414 1.414l2 2a1 1 to 001.414 0l4-4z" clipRule="evenodd"></path>
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
      <section id="education" className={`pt-12 md:pt-12 py-12 md:py-12 scroll-mt-[96px] ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className="container mx-auto px-4">
          <h2 className={`text-3xl md:text-4xl font-bold text-center mb-12 ${isDarkMode ? 'text-white' : 'text-indigo-700'}`}>
            Education
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {education.map((edu) => (
              <div key={edu.id} className={`p-6 rounded-xl shadow-lg border-b-4 border-indigo-500 hover:shadow-xl transition duration-300 transform hover:-translate-y-1 flex items-start space-x-4 ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-800'}`}>
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
      <section id="certifications" className={`mx-auto px-4 py-12 md:py-12 scroll-mt-[96px] ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <h2 className={`text-3xl md:text-4xl font-bold text-center mb-12 ${isDarkMode ? 'text-white' : 'text-indigo-700'}`}>
          Certifications
        </h2>
        <div className="relative flex items-center justify-center shadow-mask">
          <button
            onClick={scrollCertificationsLeft}
            className={`absolute left-0 z-10 h-full w-40 flex items-center justify-center text-white rounded-r-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-opacity-75 ${isDarkMode ? 'bg-indigo-700 hover:bg-indigo-600 focus:ring-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'} opacity-0`}
            aria-label="Scroll left"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>

          {/* Added ref and hide-scrollbar class */}
          <div
            ref={certificationsContainerRef}
            className="certifications-carousel flex space-x-6 overflow-x-auto pb-4 scroll-smooth hide-scrollbar py-1 pb-10"

            // Removed onMouseEnter and onMouseLeave to disable pause on hover
          >
            {/* Use displayCertifications for uniformity */}
            {displayCertifications.map((cert, index) => (
              <div key={`${cert.id}-${index}`} data-cert-card className={`rounded-xl shadow-lg overflow-hidden border-b-4 border-green-500 hover:shadow-xl transition duration-300 transform hover:-translate-y-1 flex flex-col text-center min-w-[300px] ${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'}`}>
                <img
                  src={cert.imageUrl}
                  alt={cert.name}
                  className="w-full h-32 object-cover object-top rounded-t-xl"
                  onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/150x100/CCCCCC/000000?text=Cert+Image`; }}
                />
                <div className="p-6 flex-grow flex flex-col justify-start"> {/* Align items to the start */}
                  <div className="min-h-[140px] flex flex-col justify-start text-left"> {/* Fixed height for content area */}
                    <h3 className={`text-xl font-semibold mb-1 ${isDarkMode ? 'text-green-400' : 'text-green-700'} line-clamp-2`}>{cert.name}</h3>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-lg mb-1`}>{cert.issuer}</p>
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm mb-3`}>{cert.date}</p>
                    {/* Applying line-clamp to limit description lines and ensure uniformity */}
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed text-sm line-clamp-5 pb-8`}>{cert.description}</p>
                  </div>
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center justify-center font-semibold transition duration-300 mt-auto pt-8 ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
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
            className={`absolute right-0 z-10 h-full w-40 flex items-center justify-center text-white rounded-l-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-opacity-75 ${isDarkMode ? 'bg-indigo-700 hover:bg-indigo-600 focus:ring-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'} opacity-0`}
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
              Feel free to check my GitHub account.
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
