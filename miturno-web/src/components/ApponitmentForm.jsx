import {useState} from 'react'

function AppointmentForm() {
    const[formData, setFormData] = useState({
        name: '',
        lastName: '',
        secondLastName: '',
        phoneNumber: '',
        age: '',
        date: '',
        description: '',
    })

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }
    const handleSubmit = (e) => {
    e.preventDefault()
    const payload = {
      client: {
        name: formData.name,
        lastName: formData.lastName,
        secondLastName: formData.secondLastName,
        phoneNumber: formData.phoneNumber,
        age: parseInt(formData.age),
        type: 'STANDARD',
        active: true,
      },
      appointment: {
        date: formData.date,
        description: formData.description,
        state: 'SCHEDULED',
      },
    }
    console.log('Payload:', payload) //TODO: Conect wit Backend to send Data...
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto mt-8 p-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-emerald-500 bg-clip-text text-transparent">
            Solicitar Turno
            </h2>
            <p className="text-gray-400 text-sm mt-1">Llena tus datos para agendar tu cita</p>
        </div>

        <fieldset className="border border-emerald-100 rounded-xl p-4 mb-4">
            <legend className="text-sm font-medium text-emerald-700 px-2">Datos personales</legend>

            <div className="grid grid-cols-1 gap-3 mt-2">
            <input
                type="text" name="name" value={formData.name} onChange={handleChange}
                placeholder="Nombre"
                className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
                required
            />
            <div className="grid grid-cols-2 gap-3">
                <input
                type="text" name="lastName" value={formData.lastName} onChange={handleChange}
                placeholder="Apellido paterno"
                className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
                required
                />
                <input
                type="text" name="secondLastName" value={formData.secondLastName} onChange={handleChange}
                placeholder="Apellido materno"
                className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
                required
                />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <input
                type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange}
                placeholder="Teléfono"
                className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
                required
                />
                <input
                type="number" name="age" value={formData.age} onChange={handleChange}
                placeholder="Edad" min="1" max="120"
                className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
                required
                />
            </div>
            </div>
        </fieldset>

        <fieldset className="border border-emerald-100 rounded-xl p-4 mb-6">
            <legend className="text-sm font-medium text-emerald-700 px-2">Datos de la cita</legend>

            <div className="grid grid-cols-1 gap-3 mt-2">
            <input
                type="datetime-local" name="date" value={formData.date} onChange={handleChange}
                className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
                required
            />
            <select
                name="description" value={formData.description} onChange={handleChange}
                className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition text-gray-700"
                required
            >
                <option value="">Selecciona un servicio</option>
                <option value="Caja">Caja</option>
                <option value="Atencion al cliente">Atención al cliente</option>
                <option value="Tramites">Trámites</option>
            </select>
            </div>
        </fieldset>

        <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-medium rounded-xl hover:from-emerald-700 hover:to-emerald-600 transition-all duration-200 shadow-md hover:shadow-lg"
        >
            Agendar turno
        </button>
        </form>
    )
}

export default AppointmentForm