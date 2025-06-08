import React, { useState, useEffect } from 'react';

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  category: 'content' | 'seo' | 'design' | 'marketing';
}

const Todo: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    const savedTodos = localStorage.getItem('odontomaster-todos');
    if (savedTodos) {
      return JSON.parse(savedTodos);
    }
    
    // Default OdontoMaster marketing site tasks
    return [
      // Content tasks
      { id: '1', text: 'Create landing page headline focused on OdontoMaster white-label solution', completed: true, category: 'content' },
      { id: '2', text: 'Write product benefits section highlighting dental clinic management features', completed: true, category: 'content' },
      { id: '3', text: 'Develop pricing/plans section with white-label options', completed: true, category: 'content' },
      { id: '4', text: 'Create testimonials from dental professionals', completed: true, category: 'content' },
      { id: '5', text: 'Write FAQ section addressing common questions about white-label solutions', completed: true, category: 'content' },
      
      // SEO tasks
      { id: '6', text: 'Research keywords for dental practice management software', completed: true, category: 'seo' },
      { id: '7', text: 'Optimize meta tags for dental software search terms', completed: true, category: 'seo' },
      { id: '8', text: 'Create sitemap for search engine crawlers', completed: false, category: 'seo' },
      { id: '9', text: 'Implement schema markup for dental software product', completed: true, category: 'seo' },
      { id: '10', text: 'Optimize page load speed for better SEO ranking', completed: false, category: 'seo' },
      
      // Design tasks
      { id: '11', text: 'Design hero section with dental clinic imagery', completed: true, category: 'design' },
      { id: '12', text: 'Create product screenshots/mockups of OdontoMaster interface', completed: true, category: 'design' },
      { id: '13', text: 'Design feature comparison table', completed: true, category: 'design' },
      { id: '14', text: 'Create dental-themed icons for features section', completed: true, category: 'design' },
      { id: '15', text: 'Design mobile-responsive layouts', completed: true, category: 'design' },
      
      // Marketing tasks
      { id: '16', text: 'Create lead generation form for demo requests', completed: true, category: 'marketing' },
      { id: '17', text: 'Implement email capture for marketing newsletter', completed: true, category: 'marketing' },
      { id: '18', text: 'Set up Google Analytics for conversion tracking', completed: false, category: 'marketing' },
      { id: '19', text: 'Create downloadable whitepaper on dental practice efficiency', completed: false, category: 'marketing' },
      { id: '20', text: 'Design CTA buttons for trial signups', completed: true, category: 'marketing' },
    ];
  });
  
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState<'all' | 'content' | 'seo' | 'design' | 'marketing'>('all');

  useEffect(() => {
    localStorage.setItem('odontomaster-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim() === '') return;
    
    setTodos([
      ...todos, 
      { 
        id: Date.now().toString(), 
        text: newTask, 
        completed: false,
        category: 'content' // Default category
      }
    ]);
    setNewTask('');
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const filteredTodos = filter === 'all' 
    ? todos 
    : todos.filter(todo => todo.category === filter);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTask(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTodo(e as React.FormEvent);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">OdontoMaster Marketing Site Tasks</h1>
      
      <div className="mb-6">
        <div className="flex space-x-2 mb-4">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('content')}
            className={`px-4 py-2 rounded ${filter === 'content' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Content
          </button>
          <button 
            onClick={() => setFilter('seo')}
            className={`px-4 py-2 rounded ${filter === 'seo' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
          >
            SEO
          </button>
          <button 
            onClick={() => setFilter('design')}
            className={`px-4 py-2 rounded ${filter === 'design' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
          >
            Design
          </button>
          <button 
            onClick={() => setFilter('marketing')}
            className={`px-4 py-2 rounded ${filter === 'marketing' ? 'bg-orange-600 text-white' : 'bg-gray-200'}`}
          >
            Marketing
          </button>
        </div>
        
        <form onSubmit={addTodo} className="flex">
          <input
            type="text"
            value={newTask}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add new task..."
          />
          <button 
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-r hover:bg-indigo-700"
          >
            Add
          </button>
        </form>
      </div>
      
      <ul className="space-y-2">
        {filteredTodos.map(todo => (
          <li 
            key={todo.id}
            className={`flex items-center p-3 border rounded ${todo.completed ? 'bg-gray-100' : 'bg-white'}`}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="h-5 w-5 mr-3"
            />
            <span 
              className={`flex-grow ${todo.completed ? 'line-through text-gray-500' : ''}`}
            >
              {todo.text}
            </span>
            <span className={`px-2 py-1 text-xs rounded-full mr-2 ${
              todo.category === 'content' ? 'bg-blue-100 text-blue-800' :
              todo.category === 'seo' ? 'bg-green-100 text-green-800' :
              todo.category === 'design' ? 'bg-purple-100 text-purple-800' :
              'bg-orange-100 text-orange-800'
            }`}>
              {todo.category}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>{todos.filter(todo => todo.completed).length} of {todos.length} tasks completed</p>
      </div>
    </div>
  );
};

export default Todo; 