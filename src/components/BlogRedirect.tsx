import { useEffect } from 'react';

const BlogRedirect = () => {
  useEffect(() => {
    // Redireciona para o subdomínio do blog
    window.location.replace('https://blog.huntermussel.com');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecionando para o blog...</p>
        <p className="text-sm text-gray-500 mt-2">
          Se não for redirecionado automaticamente, 
          <a 
            href="https://blog.huntermussel.com" 
            className="text-blue-600 hover:text-blue-800 ml-1"
          >
            clique aqui
          </a>
        </p>
      </div>
    </div>
  );
};

export default BlogRedirect; 