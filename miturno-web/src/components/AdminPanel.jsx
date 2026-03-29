import { useState } from 'react'

const MOCK_APPOINTMENTS = [
  { id: 1, client: { name: 'María', lastName: 'García', secondLastName: 'López' }, description: 'Caja', date: '2026-03-28T09:00', state: 'SCHEDULED' },
  { id: 2, client: { name: 'Carlos', lastName: 'Hernández', secondLastName: 'Ruiz' }, description: 'Trámites', date: '2026-03-28T09:15', state: 'SCHEDULED' },
  { id: 3, client: { name: 'Ana', lastName: 'Martínez', secondLastName: 'Soto' }, description: 'Atención al cliente', date: '2026-03-28T09:30', state: 'SCHEDULED' },
]

const STATE_LABELS = {
  SCHEDULED: { text: 'En espera', color: 'bg-gray-100 text-gray-600' },
  CALLED: { text: 'Llamado', color: 'bg-amber-100 text-amber-700' },
  ATTENDED: { text: 'Atendido', color: 'bg-emerald-100 text-emerald-700' },
  NO_SHOW: { text: 'No se presentó', color: 'bg-red-100 text-red-700' },
}

function AdminPanel() {
    const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS)  //TODO: Call backend for appointments

}

export default AdminPanel