import React from 'react';
import { Helmet } from 'react-helmet-async';

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Hunter Mussel - Soluções em Software</title>
        <meta name="description" content="Soluções inovadoras em software para gestão de clínicas odontológicas e outros setores. Conheça o OdontoMaster e nossa linha de produtos." />
      </Helmet>
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="container mx-auto px-4 py-20">
            <div className="max-w-3xl">
              <h1 className="text-5xl font-bold mb-6">
                Transforme sua gestão com nossas soluções
              </h1>
              <p className="text-xl mb-8">
                Software especializado para cada segmento. Conheça nossas soluções e revolucione seu negócio.
              </p>
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                Conheça Nossos Produtos
              </button>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Nossos Produtos</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* OdontoMaster Card */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-4">OdontoMaster</h3>
                  <p className="text-gray-600 mb-4">
                    Sistema completo para gestão de clínicas odontológicas. Simplifique processos e aumente a produtividade.
                  </p>
                  <a href="/produtos/odontomaster" className="text-blue-600 font-semibold hover:text-blue-700">
                    Saiba mais →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gray-50 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Por que escolher nossos produtos?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Alta Performance</h3>
                <p className="text-gray-600">Sistemas otimizados para máxima eficiência e velocidade.</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Segurança</h3>
                <p className="text-gray-600">Proteção de dados e conformidade com normas regulatórias.</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Suporte 24/7</h3>
                <p className="text-gray-600">Equipe especializada sempre pronta para ajudar.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
