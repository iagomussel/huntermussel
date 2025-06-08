import { ProjectData } from '../components/ProjectModal';
import env from '../config/env';

// Types for forms
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  product?: string;
  source: 'contact' | 'hero' | 'products';
}

const DISCORD_WEBHOOK_URL = 'YOUR_DISCORD_WEBHOOK_URL';

// Send to n8n webhook
export const sendToN8N = async (data: any, type: 'contact' | 'project') => {
  try {
    const payload = {
      type,
      timestamp: new Date().toISOString(),
      data,
      source: 'huntermussel-website'
    };

    const response = await fetch(env.N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return { success: true, data: await response.json() };
  } catch (error) {
    console.error('Error sending to n8n:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

// Send contact form
export const sendContactForm = async (data: ContactFormData) => {
  try {
    // Send to n8n
    const n8nResult = await sendToN8N(data, 'contact');
    
    if (!n8nResult.success) {
      throw new Error('Failed to send to n8n');
    }

    return { success: true, message: 'Message sent successfully!' };
  } catch (error) {
    console.error('Error sending contact form:', error);
    return { 
      success: false, 
      message: 'Error sending message. Please try again later.' 
    };
  }
};

export const sendProjectNotification = async (data: ProjectData) => {
  try {
    // Send to n8n
    const n8nResult = await sendToN8N(data, 'project');
    
    if (!n8nResult.success) {
      throw new Error('Failed to send to n8n');
    }

    // Keep Discord as backup (if configured)
    if (DISCORD_WEBHOOK_URL && DISCORD_WEBHOOK_URL !== 'YOUR_DISCORD_WEBHOOK_URL') {
      const message = {
        embeds: [{
          title: '🚀 New Project Started!',
          color: 0x4F46E5, // Indigo color
          fields: [
            {
              name: '👤 Client',
              value: data.name,
              inline: true
            },
            {
              name: '📧 Email',
              value: data.email,
              inline: true
            },
            {
              name: '📱 Phone',
              value: data.phone,
              inline: true
            },
            {
              name: '📝 Project Description',
              value: data.projectDescription
            }
          ],
          timestamp: new Date().toISOString()
        }]
      };

      await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message)
      });
    }

    return { success: true, message: 'Project sent successfully!' };
  } catch (error) {
    console.error('Error sending project notification:', error);
    return { 
      success: false, 
      message: 'Error sending project. Please try again later.' 
    };
  }
};
