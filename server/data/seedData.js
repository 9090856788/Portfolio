export const initialSeedData = {
  user: {
    _id: "664fca4cc0e4d9b9d392545b",
    fullName: "Kanhu Charan Sahoo",
    email: "kanhucharansahoo595@gmail.com",
    phone: "+91 9090856788",
    aboutMe: "As a Frontend developer passionate about creating seamless web experiences & developing robust and problem-solving skills and proven experience in creating and designing software in a test-driven environment.\n\nMy expertise spans front-end development, where I have good hands-on experience with HTML, CSS, JavaScript, TypeScript, React.js, Next.js, Material UI, Tailwind CSS, and Shadcn for crafting sleek user interfaces.\n\nOn the server side, my focus revolves around the reliable functioning of applications using Node.js and Express.js.",
    role: "Frontend Developer & UI/UX Specialist",
    location: "Bhubaneswar, Odisha, India",
    portfolioURL: "https://kanhucharansahoo.dev",
    githubURL: "https://github.com/9090856788",
    instagramURL: "https://instagram.com",
    facebookURL: "https://facebook.com",
    twitterURL: "https://twitter.com",
    linkedInURL: "https://linkedin.com/in/kanhucharansahoo",
    avatar: {
      public_id: "portfolio_avatar_default",
      url: "/src/img/Kanhu.jpg"
    },
    resume: {
      public_id: "portfolio_resume_default",
      url: "https://drive.google.com/file/d/sample-resume"
    },
    services: [
      {
        id: "srv-1",
        title: "Frontend Development",
        content: "As a Frontend Developer, I am captivated by creating dynamic and scalable web applications using my expertise in React.js and Next.js. I am always eager to dive into new projects that leverage these technologies, along with UI frameworks like MUI, to build fast, user-friendly applications.",
        imageSrc: "/src/img/frontendImage.jpg"
      },
      {
        id: "srv-2",
        title: "Freelancer & Full-Stack",
        content: "I specialize in building high-performance web applications with React.js and Next.js. Using modern UI frameworks, I create scalable, responsive designs tailored to your needs. I combine advanced technology with innovative design to deliver user-centric solutions.",
        imageSrc: "/src/img/freelancer.jpg"
      }
    ]
  },
  projects: [
    {
      _id: "proj-1",
      title: "Full-Stack Portfolio System",
      description: "A comprehensive developer portfolio with an admin control panel, featuring neumorphic and glassmorphic UI elements, dynamic project management, and live content editing.",
      gitRepoLink: "https://github.com/9090856788/Portfolio",
      projectLink: "https://kanhucharansahoo.dev",
      technology: "React.js, Node.js, Express, MongoDB, MUI",
      stack: "MERN Stack",
      deploy: "Cloud Run / Vercel",
      projectBanner: {
        public_id: "proj_banner_1",
        url: "/src/img/frontendImage.jpg"
      }
    },
    {
      _id: "proj-2",
      title: "Interactive Web Dashboard",
      description: "A modern analytics and data visualization dashboard with dark mode support, glassmorphic widgets, and responsive layouts across all screen resolutions.",
      gitRepoLink: "https://github.com/9090856788",
      projectLink: "https://github.com/9090856788",
      technology: "React, Redux Toolkit, TanStack Query, CSS",
      stack: "Frontend",
      deploy: "Live",
      projectBanner: {
        public_id: "proj_banner_2",
        url: "/src/img/freelancer.jpg"
      }
    },
    {
      _id: "proj-3",
      title: "E-Commerce Experience",
      description: "Sleek, performant shopping interface with cart management, filters, responsive product galleries, and streamlined checkout.",
      gitRepoLink: "https://github.com/9090856788",
      projectLink: "https://github.com/9090856788",
      technology: "Next.js, TypeScript, Material UI",
      stack: "Full-Stack",
      deploy: "Live",
      projectBanner: {
        public_id: "proj_banner_3",
        url: "/src/img/frontendImage.jpg"
      }
    }
  ],
  skills: [
    { _id: "sk-1", title: "React.js", proficiency: 92, svg: { url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" } },
    { _id: "sk-2", title: "JavaScript (ES6+)", proficiency: 90, svg: { url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" } },
    { _id: "sk-3", title: "TypeScript", proficiency: 85, svg: { url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" } },
    { _id: "sk-4", title: "Next.js", proficiency: 82, svg: { url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" } },
    { _id: "sk-5", title: "HTML5 & CSS3", proficiency: 95, svg: { url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" } },
    { _id: "sk-6", title: "Material UI (MUI)", proficiency: 88, svg: { url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/materialui/materialui-original.svg" } },
    { _id: "sk-7", title: "Redux Toolkit", proficiency: 86, svg: { url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg" } },
    { _id: "sk-8", title: "Node.js & Express", proficiency: 80, svg: { url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" } },
    { _id: "sk-9", title: "MongoDB", proficiency: 78, svg: { url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" } },
    { _id: "sk-10", title: "Git & GitHub", proficiency: 88, svg: { url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" } }
  ],
  software: [
    { _id: "sw-1", name: "VS Code", svg: { url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" } },
    { _id: "sw-2", name: "Postman", svg: { url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg" } },
    { _id: "sw-3", name: "Figma", svg: { url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" } },
    { _id: "sw-4", name: "GitHub", svg: { url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" } }
  ],
  timeline: [
    {
      _id: "tl-1",
      title: "Frontend Developer",
      company: "Tech Solutions",
      period: "2023 - Present",
      description: "Developing responsive web applications, optimizing front-end performance, building reusable components, and translating UI/UX mockups into production-ready code.",
      timeline: {
        from: "2023",
        to: "Present"
      }
    },
    {
      _id: "tl-2",
      title: "Web Development Intern",
      company: "Digital Innovations",
      period: "2022 - 2023",
      description: "Collaborated on React and JavaScript frontend modules, implemented interactive features, and assisted in API integrations.",
      timeline: {
        from: "2022",
        to: "2023"
      }
    },
    {
      _id: "tl-3",
      title: "Bachelor of Technology",
      company: "Biju Patnaik University of Technology",
      period: "2019 - 2023",
      description: "Completed degree in Engineering with focus on computer science, data structures, and web technologies.",
      timeline: {
        from: "2019",
        to: "2023"
      }
    }
  ],
  messages: [
    {
      _id: "msg-1",
      senderName: "Sarah Jenkins",
      subject: "Frontend Opportunity",
      message: "Hi Kanhu, loved your portfolio and projects! Would you be open for a chat regarding a Senior Frontend role?",
      createdAt: new Date().toISOString()
    }
  ]
};
