# Strategic Decisions

## MGT-001: Project Structure Clarification
Type: Organizational  
Impact: High  
Status: Implemented  
Description: Clarified that huntermussel is an institutional website that sells OdontoMaster (dental management system) as a product. OdontoMaster itself is a separate repository.  
Stakeholders: All team members  
Timeline: Immediate  
Success Metrics: Clear understanding of project goals and scope  

## MGT-002: Team Role Updates
Type: Resource  
Impact: Medium  
Status: Implemented  
Description: Updated team roles to focus on institutional website development rather than dental management system features  
Stakeholders: Hugo (Product Owner), Fernanda (Project Manager), Lucas (Senior Developer), Sofia (UX/UI Designer), Rafael (Technical Writer)  
Timeline: Immediate  
Success Metrics: Proper task allocation and reduced confusion  

Team Actions:
- Hugo: Focus on marketing strategy for OdontoMaster product
- Fernanda: Manage institutional website development timeline  
- Lucas: Implement marketing-focused technical features
- Sofia: Design institutional website UI/UX
- Rafael: Create marketing content and documentation

## MGT-003: Blog Separation Strategy
Type: Technical/Architectural  
Impact: Medium  
Status: Implemented  
Description: Separated blog functionality from main institutional website. Blog now redirects to blog.huntermussel.com subdomain for better content management and SEO separation.  
Stakeholders: Hugo (content strategy), Lucas (implementation), Sofia (design consistency)  
Timeline: Immediate implementation  
Success Metrics: Clean separation of concerns, improved site performance, better SEO structure  

Technical Implementation:
- Created BlogRedirect component for client-side redirection
- Added /blog route with automatic redirection 
- Updated Navbar to include Blog link
- Configured Netlify 301 redirect for server-side redirection
- Removed blog from main site sitemap
- Maintained navigation UX while separating content management

Team Actions:
- Hugo: Plan blog content strategy for subdomain
- Lucas: Ensure redirect implementation works correctly
- Sofia: Maintain design consistency between main site and blog subdomain
- Rafael: Coordinate content migration to blog subdomain 