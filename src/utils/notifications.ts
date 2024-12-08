import { ProjectData } from '../components/ProjectModal';

const DISCORD_WEBHOOK_URL = 'YOUR_DISCORD_WEBHOOK_URL';

export const sendProjectNotification = async (data: ProjectData) => {
  try {
    const message = {
      embeds: [{
        title: '🚀 Novo Projeto Iniciado!',
        color: 0x4F46E5, // Indigo color
        fields: [
          {
            name: '👤 Cliente',
            value: data.name,
            inline: true
          },
          {
            name: '📧 Email',
            value: data.email,
            inline: true
          },
          {
            name: '📱 Telefone',
            value: data.phone,
            inline: true
          },
          {
            name: '📝 Descrição do Projeto',
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

    return true;
  } catch (error) {
    console.error('Error sending notification:', error);
    return false;
  }
};