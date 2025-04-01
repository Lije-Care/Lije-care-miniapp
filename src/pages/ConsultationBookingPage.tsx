// src/app/(tabs)/consultation/page.tsx
'use client'

import { Button } from '@telegram-apps/telegram-ui';
import { useState } from 'react';
import { MdMessage } from 'react-icons/md';



const concerns = ['Nutrition', 'Sleep Issues', 'Growth', 'Vaccination', 'Skin Issues'];
const professionals = [
  {
    id: 1,
    name: 'Dr. Hana Belay',
    specialty: 'Pediatric Nutritionist',
    languages: ['Amharic', 'English'],
    image: '/doctors/hana.png',
  },
  {
    id: 2,
    name: 'Dr. Elias Mekonnen',
    specialty: 'Child Psychologist',
    languages: ['English'],
    image: '/doctors/elias.png',
  },
];

export default function ConsultationTab() {
  const [selectedConcern, setSelectedConcern] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [confirmed, setConfirmed] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');
  // const { joinRoom, meetingUrl } = use100ms();

  const sendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages([...chatMessages, newMessage]);
      setNewMessage('');
    }
  };

  if (chatOpen && selectedDoctor) {
    return (
      <div className="flex flex-col h-full p-4">
        <h2 className="text-lg font-semibold mb-2">Chatting with {selectedDoctor.name}</h2>
        <div className="flex-1 overflow-y-auto space-y-2 mb-4">
          {chatMessages.map((msg, idx) => (
            <div key={idx} className="bg-gray-100 dark:bg-gray-700 p-2 rounded-md w-max max-w-xs">
              {msg}
            </div>
          ))}
        </div>
        <div className="mt-auto flex items-center gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none"
          />
          <Button onClick={sendMessage}>Send</Button>
        </div>
        <Button className="mt-4" onClick={() => setChatOpen(false)}>Back to Booking</Button>
      </div>
    );
  }

  if (confirmed) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-bold mb-4">Consultation Confirmed!</h2>
        <p className="mb-2">You have booked a session with <strong>{selectedDoctor?.name}</strong></p>
        <p className="mb-4">Date: {selectedDate}</p>
        <Button onClick={()=>{}}>Join Video Call</Button>
        {/* {meetingUrl && (
          <div className="mt-4 text-sm text-gray-500">Meeting Link: <a href={meetingUrl} target="_blank" rel="noreferrer" className="text-blue-500 underline">Join Now</a></div>
        )} */}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-bold">Consult a Professional</h1>

      <div>
        <p className="font-semibold mb-2">Select Concern Category</p>
        <select
          value={selectedConcern}
          onChange={(e) => setSelectedConcern(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-primary"
        >
          <option value="" disabled>Select a concern</option>
          {concerns.map((concern) => (
            <option key={concern} value={concern}>{concern}</option>
          ))}
        </select>
      </div>

      {selectedConcern && (
        <div>
          <p className="font-semibold mb-2">Choose a Professional</p>
          <div className="space-y-2">
            {professionals.map((pro) => (
              <div
                key={pro.id}
                className={`flex items-center p-3 border rounded-md justify-between hover:shadow-md transition-all ${selectedDoctor?.id === pro.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
              >
                <div onClick={() => setSelectedDoctor(pro)} className="flex items-center cursor-pointer">
                  <img src={pro.image} alt={pro.name} className="w-12 h-12 rounded-full object-cover mr-4" />
                  <div>
                    <p className="font-bold text-md">{pro.name}</p>
                    <p className="text-sm text-gray-500">{pro.specialty}</p>
                    <p className="text-sm">Languages: {pro.languages.join(', ')}</p>
                  </div>
                </div>
                <button onClick={() => { setSelectedDoctor(pro); setChatOpen(true); }} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                  <MdMessage className="w-5 h-5 text-blue-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedDoctor && (
        <div>
          <p className="font-semibold mb-2">Choose a Time Slot</p>
          <input
            type="date"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-primary"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      )}

      {selectedDate && (
        <Button className="w-full mt-4" onClick={() => setConfirmed(true)}>Confirm Booking</Button>
      )}
    </div>
  );
}
