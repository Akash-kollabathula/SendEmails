import { EmailTemplate } from '../types';

export const DEFAULT_USER_INFO = {
  name: 'Akash Kollabathula',
  title: 'SDET | Playwright + TypeScript Automation Engineer',
  experience: '3 years',
  currentRole: 'Software Engineer – QA Automation at HCL Technologies',
  email: 'kollabathula.akash.test@gmail.com',
  phone: '+91 9676996550',
  location: 'Hyderabad, India',
  skills: 'Playwright, TypeScript, JavaScript, Python, REST API Automation, CI/CD (GitHub Actions/Jenkins), AI-Assisted Testing (MCP Server)',
  resumeFileName: 'Akash_Kollabathula_SDET_3YOE_Resume.pdf'
};

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'sdet-playwright-featured',
    title: 'SDET / Automation Engineer (Playwright + TypeScript)',
    description: 'High-converting application highlighting 3 YOE, HCL Technologies experience, POM frameworks, and REST API testing.',
    badge: 'Recommended',
    subject: 'Application: SDET / Automation QA Engineer (Playwright + TypeScript | 3 YOE) - Akash Kollabathula',
    body: `<p>Hi {{recruiter_name}},</p>

<p>I hope you are having a productive week.</p>

<p>I am writing to express my strong interest in SDET / QA Automation Engineer roles at <strong>{{company}}</strong>. With <strong>3 years of professional experience</strong> designing robust automated testing frameworks for web applications and REST APIs, I am confident I can bring immediate velocity and quality assurance to your engineering teams.</p>

<p>Currently, as a <strong>Software Engineer – QA Automation at HCL Technologies</strong>, my core work revolves around:</p>
<ul>
  <li><strong>Playwright &amp; TypeScript Automation:</strong> Architecting and scaling Page Object Model (POM) frameworks with custom fixtures, auto-waiting, and parallel workers, achieving 60%+ automation coverage of critical workflows.</li>
  <li><strong>Flaky Test Reduction:</strong> Successfully dropped test suite flakiness from 25% to under 15% using reliable locators, web-first assertions, and synchronization optimizations.</li>
  <li><strong>REST API Automation:</strong> Automated 50+ API test cases using Playwright <code>APIRequestContext</code> and Postman, validating schema contracts, response payloads, and database states.</li>
  <li><strong>CI/CD Pipelines:</strong> Integrating automated test execution into GitHub Actions and Jenkins for automated regression runs with Allure reporting.</li>
  <li><strong>AI-Assisted Testing:</strong> Leveraging Playwright MCP Server, Copilot, and agent workflows to accelerate test scenario generation and maintenance by ~40%.</li>
</ul>

<p>I have attached my updated resume for your review. I would welcome the opportunity to connect and discuss how my hands-on test automation expertise aligns with upcoming opportunities at <strong>{{company}}</strong>.</p>

<p>Thank you for your time and consideration.</p>

<p>Warm regards,<br>
<strong>{{my_name}}</strong><br>
SDET | Playwright + TypeScript Automation Engineer<br>
📧 {{my_email}} | 📱 {{my_phone}} | 📍 {{my_location}}</p>`
  },
  {
    id: 'ai-assisted-sdet',
    title: 'Modern QA & AI-Assisted Automation Specialist',
    description: 'Focuses on next-gen testing techniques, Playwright MCP server, agent-driven authoring, and speed.',
    badge: 'Modern & AI',
    subject: 'Exploring QA Automation / SDET Opportunities at {{company}} - Akash Kollabathula',
    body: `<p>Dear {{recruiter_name}},</p>

<p>I hope this email finds you well.</p>

<p>I follow <strong>{{company}}</strong>'s engineering innovations with great interest and wanted to reach out regarding test automation and SDET openings on your team.</p>

<p>As an SDET with 3 years of hands-on experience in <strong>Playwright, TypeScript, and modern QA architectures</strong>, I focus on building reliable, fast, zero-flakiness test suites that empower engineering teams to release with complete confidence. In my current role at HCL Technologies, I have actively integrated <strong>AI-assisted testing tools</strong> (including Playwright MCP Server, Claude, and GitHub Copilot) to design, heal, and maintain E2E test suites, cutting test authoring time by ~40% while upholding high coverage.</p>

<p><strong>A quick snapshot of my qualifications:</strong></p>
<ul>
  <li>Comprehensive E2E and API automation using <strong>Playwright, TypeScript, Postman, and SQL</strong>.</li>
  <li>Experience managing CI/CD pipelines (GitHub Actions, Jenkins) and defect reporting workflows in Jira.</li>
  <li>Proven track record in reducing test flakiness and execution time through parallel execution workers.</li>
</ul>

<p>My resume is attached to this email. If there are relevant roles open or coming up at {{company}}, I would love to introduce myself and explore potential alignment.</p>

<p>Best regards,<br>
<strong>{{my_name}}</strong><br>
{{my_email}} &bull; {{my_phone}}</p>`
  },
  {
    id: 'quick-recruiter-pitch',
    title: 'Concise Recruiter / Hiring Lead Outreach',
    description: 'Short, clean, and direct inquiry designed for busy technical recruiters and engineering managers.',
    badge: 'Concise',
    subject: 'Akash Kollabathula - SDET (Playwright + TypeScript | 3 YOE) for {{company}}',
    body: `<p>Hi {{recruiter_name}},</p>

<p>I hope your week is off to a great start.</p>

<p>I am reaching out to see if <strong>{{company}}</strong> is currently hiring or building a pipeline for <strong>SDET / QA Automation Engineers</strong>.</p>

<p>Briefly about me: I have <strong>3 years of experience</strong> working as a QA Automation Engineer at HCL Technologies, specializing in <strong>Playwright, TypeScript, REST API testing, and CI/CD pipelines (GitHub Actions/Jenkins)</strong>. I specialize in building maintainable test frameworks from scratch and reducing regression turnaround times.</p>

<p>I have attached my resume for your convenience. If there is a suitable opening or someone on your team I should connect with, I would truly appreciate your pointer!</p>

<p>Thank you for your time,<br>
<strong>{{my_name}}</strong><br>
{{my_phone}} | {{my_email}}</p>`
  },
  {
    id: 'custom-template',
    title: 'Custom Template (Fully Customizable)',
    description: 'Draft your own custom message using smart tags like {{company}}, {{recruiter_name}}, {{my_name}}, etc.',
    badge: 'Custom',
    subject: 'Job Opportunity Inquiry - SDET - Akash Kollabathula',
    body: `<p>Hello {{recruiter_name}},</p>

<p>I hope you are doing well.</p>

<p>I am reaching out regarding opportunities for an <strong>SDET / Automation Test Engineer</strong> at <strong>{{company}}</strong>. I bring 3 years of hands-on experience in Playwright, TypeScript, and API automation with a proven track record at HCL Technologies.</p>

<p>Please find my updated resume attached to this email. I would appreciate the chance to discuss how I can contribute to {{company}}'s QA and software quality goals.</p>

<p>Best regards,<br>
<strong>{{my_name}}</strong><br>
{{my_email}} | {{my_phone}}</p>`
  }
];

export const SAMPLE_RECRUITER_LIST = [
  {
    email: 'kollabathula.akash.test@gmail.com',
    name: 'Akash (Self-Test)',
    company: 'Test Run',
    role: 'SDET / Automation Engineer'
  },
  {
    email: 'talent@google.com',
    name: 'Google Tech Recruiting Team',
    company: 'Google',
    role: 'Software Engineer in Test'
  },
  {
    email: 'careers@microsoft.com',
    name: 'Microsoft Engineering Talent',
    company: 'Microsoft',
    role: 'Quality Software Engineer'
  },
  {
    email: 'recruiting@amazon.com',
    name: 'Amazon QA Recruiting',
    company: 'Amazon',
    role: 'Quality Assurance Engineer (QAE)'
  }
];
