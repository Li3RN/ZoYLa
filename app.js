// ==========================================================================
// INITIAL DATA & STORAGE UTILITIES
// ==========================================================================

const DEFAULT_SERVICES = [
    {
        id: "serv-1",
        name: "Terapia Individual Gestalt",
        description: "Espacio de autodescubrimiento y presencia para procesar emociones, resolver bloqueos existenciales y reconciliarte con tu presente.",
        duration: 60,
        price: 60,
        icon: "brain"
    },
    {
        id: "serv-2",
        name: "Coaching Ontológico",
        description: "Acompañamiento enfocado a la acción, redefiniendo tus metas personales y profesionales. Ideal para transiciones de vida.",
        duration: 60,
        price: 70,
        icon: "compass"
    },
    {
        id: "serv-3",
        name: "Sesión de Mindfulness y Relajación",
        description: "Prácticas guiadas individuales para reducir el estrés, arraigar la mente en el cuerpo y cultivar la calma interior.",
        duration: 45,
        price: 45,
        icon: "sparkles"
    }
];

const DEFAULT_CLIENTS = [
    {
        id: "cli-1",
        name: "Ana García",
        email: "ana.garcia@gmail.com",
        phone: "+34 611 222 333",
        notes: [
            { date: "2026-07-01T10:00:00Z", text: "Iniciamos proceso Gestalt. Presenta ansiedad por transición laboral. Trabajamos respiración y arraigo." },
            { date: "2026-07-08T10:00:00Z", text: "Segunda sesión. Exploramos la 'silla vacía' para resolver conflicto pendiente con su antiguo jefe. Reporta mejor descanso." }
        ]
    },
    {
        id: "cli-2",
        name: "Carlos Mendoza",
        email: "carlos.mendoza@outlook.com",
        phone: "+34 622 333 444",
        notes: [
            { date: "2026-07-05T12:00:00Z", text: "Sesión de coaching de vida. Busca definir objetivos de cara a emprender. Identificamos creencias limitantes sobre el dinero." }
        ]
    },
    {
        id: "cli-3",
        name: "Laura Martínez",
        email: "laura.mtz@yahoo.com",
        phone: "+34 633 444 555",
        notes: []
    }
];

const DEFAULT_APPOINTMENTS = [
    {
        id: "app-1",
        clientId: "cli-1",
        clientName: "Ana García",
        clientEmail: "ana.garcia@gmail.com",
        clientPhone: "+34 611 222 333",
        serviceId: "serv-1",
        serviceName: "Terapia Individual Gestalt",
        date: "2026-07-15",
        time: "10:00",
        price: 60,
        status: "confirmed", // pending, confirmed, completed, cancelled
        notes: "Continuación de la sesión anterior."
    },
    {
        id: "app-2",
        clientId: "cli-2",
        clientName: "Carlos Mendoza",
        clientEmail: "carlos.mendoza@outlook.com",
        clientPhone: "+34 622 333 444",
        serviceId: "serv-2",
        serviceName: "Coaching Ontológico",
        date: "2026-07-15",
        time: "12:00",
        price: 70,
        status: "pending",
        notes: "Primera sesión sobre metas de emprendimiento."
    },
    {
        id: "app-3",
        clientId: "cli-3",
        clientName: "Laura Martínez",
        clientEmail: "laura.mtz@yahoo.com",
        clientPhone: "+34 633 444 555",
        serviceId: "serv-3",
        serviceName: "Sesión de Mindfulness",
        date: "2026-07-16",
        time: "16:00",
        price: 45,
        status: "confirmed",
        notes: ""
    }
];

// ==========================================================================
// SUPABASE CONFIGURATION
// ==========================================================================
const SUPABASE_URL = "https://rpmzfnufbfofglqanzxf.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwbXpmbnVmYmZvZmdscWFuenhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxMjM2NzAsImV4cCI6MjEwMjY5OTY3MH0.7PMQ4nEorCgdG4LHovdL4XFpr5MUyKCFKVPYT-nWbzg";

let supabaseClient = null;
if (window.supabase && SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log("✅ Conectado a Supabase Client SDK");
    } catch(e) {
        console.error("Error inicializando Supabase:", e);
    }
}

const DEFAULT_SITE_CONTENT = {
    heroBadge: "Bienvenida a tu transformación",
    heroTitle: "Encuentra tu equilibrio y florece en tu propio camino",
    heroSubtitle: "Sesiones de coaching y terapia personalizadas para ayudarte a superar bloqueos, reconectar con tu esencia y diseñar una vida alineada con tu propósito.",
    aboutTitle: "Hola, soy Zoyla",
    aboutLead: "Acompaño a personas en sus procesos de transición, autoconocimiento y empoderamiento personal.",
    aboutBody: "Mi enfoque combina herramientas de coaching existencial, terapia gestalt y mindfulness. Creo firmemente que cada persona posee los recursos necesarios para sanar y expandirse; mi labor es facilitar el espacio seguro, cálido y libre de juicio donde puedas redescubrirlos.",
    aboutQuote: "\"El cambio no ocurre cuando intentamos ser lo que no somos, sino cuando aceptamos plenamente lo que somos.\"",
    diagTitle: "¿Cómo identificamos y abordamos tu situación?",
    diagSubtitle: "Un proceso estructurado para guiarte desde la inquietud inicial hasta el bienestar sostenido.",
    servicesTitle: "Cómo podemos trabajar juntos",
    bookingTitle: "Reserva tu sesión en línea"
};

// App State Management
class AppState {
    constructor() {
        this.services = [];
        this.clients = [];
        this.appointments = [];
        this.siteContent = DEFAULT_SITE_CONTENT;
        this.isLoggedIn = false;
    }

    applySiteContent() {
        const c = this.siteContent || DEFAULT_SITE_CONTENT;
        const setTxt = (id, txt) => {
            const el = document.getElementById(id);
            if (el && txt) el.innerText = txt;
        };

        setTxt("public-hero-badge", c.heroBadge);
        setTxt("public-hero-title", c.heroTitle);
        setTxt("public-hero-subtitle", c.heroSubtitle);
        setTxt("public-about-title", c.aboutTitle);
        setTxt("public-about-lead", c.aboutLead);
        setTxt("public-about-body", c.aboutBody);
        setTxt("public-about-quote", c.aboutQuote);
        setTxt("public-diag-subtitle", c.diagSubtitle);

        const headingDiag = document.getElementById("diagnostic-heading");
        if (headingDiag && c.diagTitle) headingDiag.innerText = c.diagTitle;
    }

    async saveSiteContent(newContent) {
        this.siteContent = { ...this.siteContent, ...newContent };
        this.applySiteContent();

        if (supabaseClient) {
            try {
                for (const [key, value] of Object.entries(newContent)) {
                    await supabaseClient.from('site_content').upsert({ key, value });
                }
            } catch(e) {
                console.error("Error guardando site_content en Supabase:", e);
            }
        }
    }

    populateContentEditorForm() {
        const c = this.siteContent || DEFAULT_SITE_CONTENT;
        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if (el && val !== undefined) el.value = val;
        };

        setVal("cms-hero-badge", c.heroBadge);
        setVal("cms-hero-title", c.heroTitle);
        setVal("cms-hero-subtitle", c.heroSubtitle);
        setVal("cms-about-title", c.aboutTitle);
        setVal("cms-about-lead", c.aboutLead);
        setVal("cms-about-body", c.aboutBody);
        setVal("cms-about-quote", c.aboutQuote);
        setVal("cms-diag-title", c.diagTitle);
        setVal("cms-diag-subtitle", c.diagSubtitle);
        setVal("cms-services-title", c.servicesTitle);
        setVal("cms-booking-title", c.bookingTitle);
    }

    async initData() {
        // 1. Cargar desde Supabase
        if (supabaseClient) {
            try {
                const [servRes, cliRes, appRes, cntRes] = await Promise.all([
                    supabaseClient.from('services').select('*'),
                    supabaseClient.from('clients').select('*, client_notes(note_date, note_text)'),
                    supabaseClient.from('appointments').select('*'),
                    supabaseClient.from('site_content').select('*')
                ]);

                if (!servRes.error && !cliRes.error && !appRes.error) {
                    this.services = servRes.data || [];
                    this.clients = (cliRes.data || []).map(c => ({
                        ...c,
                        notes: (c.client_notes || []).map(n => ({ date: n.note_date, text: n.note_text }))
                    }));
                    this.appointments = (appRes.data || []).map(a => ({
                        id: a.id,
                        clientId: a.client_id,
                        clientName: a.client_name,
                        clientEmail: a.client_email,
                        clientPhone: a.client_phone,
                        serviceId: a.service_id,
                        serviceName: a.service_name,
                        date: a.appointment_date,
                        time: a.appointment_time,
                        price: parseFloat(a.price),
                        status: a.status,
                        notes: a.notes
                    }));

                    if (!cntRes.error && cntRes.data && cntRes.data.length > 0) {
                        const fetchedContent = {};
                        cntRes.data.forEach(item => {
                            fetchedContent[item.key] = item.value;
                        });
                        this.siteContent = { ...DEFAULT_SITE_CONTENT, ...fetchedContent };
                    }

                    this.applySiteContent();
                    return;
                }
            } catch(e) {
                console.warn("Error leyendo de Supabase:", e);
            }
        }

        // 2. Intentar cargar desde API REST Backend si no hay Supabase
        try {
            const [servicesRes, clientsRes, appointmentsRes] = await Promise.all([
                fetch('/api/services'),
                fetch('/api/clients'),
                fetch('/api/appointments')
            ]);

            if (servicesRes.ok && clientsRes.ok && appointmentsRes.ok) {
                this.services = await servicesRes.json();
                this.clients = await clientsRes.json();
                this.appointments = await appointmentsRes.json();
                return;
            }
        } catch (e) {
            console.warn("API Backend no disponible:", e);
        }

        // Fallback a valores por defecto en memoria
        this.services = DEFAULT_SERVICES;
        this.clients = DEFAULT_CLIENTS;
        this.appointments = DEFAULT_APPOINTMENTS;
    }

    async saveService(service, isEdit = false) {
        if (isEdit) {
            const index = this.services.findIndex(s => s.id === service.id);
            if (index !== -1) this.services[index] = service;
            if (supabaseClient) {
                await supabaseClient.from('services').update(service).eq('id', service.id);
            } else {
                try {
                    await fetch(`/api/services/${service.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(service)
                    });
                } catch(e) { console.error(e); }
            }
        } else {
            this.services.push(service);
            if (supabaseClient) {
                await supabaseClient.from('services').insert([service]);
            } else {
                try {
                    await fetch('/api/services', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(service)
                    });
                } catch(e) { console.error(e); }
            }
        }
    }

    async deleteService(serviceId) {
        this.services = this.services.filter(s => s.id !== serviceId);
        if (supabaseClient) {
            await supabaseClient.from('services').delete().eq('id', serviceId);
        } else {
            try {
                await fetch(`/api/services/${serviceId}`, { method: 'DELETE' });
            } catch(e) { console.error(e); }
        }
    }

    async saveClient(client) {
        const existingIndex = this.clients.findIndex(c => c.id === client.id);
        if (existingIndex !== -1) {
            this.clients[existingIndex] = client;
            if (supabaseClient) {
                await supabaseClient.from('clients').update({ name: client.name, email: client.email, phone: client.phone }).eq('id', client.id);
            } else {
                try {
                    await fetch(`/api/clients/${client.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(client)
                    });
                } catch(e) { console.error(e); }
            }
        } else {
            this.clients.push(client);
            if (supabaseClient) {
                await supabaseClient.from('clients').insert([{ id: client.id, name: client.name, email: client.email, phone: client.phone }]);
            } else {
                try {
                    await fetch('/api/clients', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(client)
                    });
                } catch(e) { console.error(e); }
            }
        }
    }

    async addClientNote(clientId, note) {
        const client = this.clients.find(c => c.id === clientId);
        if (client) {
            if (!client.notes) client.notes = [];
            client.notes.push(note);
            if (supabaseClient) {
                await supabaseClient.from('client_notes').insert([{ client_id: clientId, note_date: note.date, note_text: note.text }]);
            } else {
                try {
                    await fetch(`/api/clients/${clientId}/notes`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(note)
                    });
                } catch(e) { console.error(e); }
            }
        }
    }

    async saveAppointment(appointment) {
        this.appointments.push(appointment);
        if (supabaseClient) {
            await supabaseClient.from('appointments').insert([{
                id: appointment.id,
                client_id: appointment.clientId,
                client_name: appointment.clientName,
                client_email: appointment.clientEmail,
                client_phone: appointment.clientPhone,
                service_id: appointment.serviceId,
                service_name: appointment.serviceName,
                appointment_date: appointment.date,
                appointment_time: appointment.time,
                price: appointment.price,
                status: appointment.status || 'confirmed',
                notes: appointment.notes || ''
            }]);
        } else {
            try {
                await fetch('/api/appointments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(appointment)
                });
            } catch(e) { console.error(e); }
        }
    }

    async updateAppointmentStatus(appId, newStatus) {
        const app = this.appointments.find(a => a.id === appId);
        if (app) {
            app.status = newStatus;
            if (supabaseClient) {
                await supabaseClient.from('appointments').update({ status: newStatus }).eq('id', appId);
            } else {
                try {
                    await fetch(`/api/appointments/${appId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(app)
                    });
                } catch(e) { console.error(e); }
            }
        }
    }
}

const state = new AppState();

// ==========================================================================
// SPA NAVIGATION & ROUTING
// ==========================================================================
const publicView = document.getElementById("public-view");
const adminView = document.getElementById("admin-view");
const navMenu = document.getElementById("nav-menu");
const mainNav = document.getElementById("main-nav");
const mainFooter = document.getElementById("main-footer");

function showView(viewName) {
    if (viewName === "public") {
        publicView.classList.add("active");
        adminView.classList.remove("active");
        mainNav.style.display = "block";
        if (mainFooter) mainFooter.style.display = "block";
        document.title = "Zoyla | Terapia Gestalt, Coaching Ontológico y Mindfulness";
        window.scrollTo(0, 0);
    } else if (viewName === "admin") {
        if (!state.isLoggedIn) {
            openModal("login-modal");
            return;
        }
        publicView.classList.remove("active");
        adminView.classList.add("active");
        mainNav.style.display = "none";
        if (mainFooter) mainFooter.style.display = "none";
        document.title = "Panel de Administración Profesional | Zoyla PRO";
        renderAdminDashboard();
        renderAdminAppointments();
        renderAdminClients();
        renderAdminServices();
    }
}

// Active Nav Links Highlights
const sections = document.querySelectorAll("section[id]");
window.addEventListener("scroll", () => {
    if (publicView.classList.contains("active")) {
        let scrollY = window.pageYOffset;
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute("id");
            const navLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);
            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add("active");
                } else {
                    navLink.classList.remove("active");
                }
            }
        });
    }
});

// ==========================================================================
// BOOKING FLOW WIZARD
// ==========================================================================
let bookingData = {
    service: null,
    date: null,
    time: null
};

// Render Public Services cards & Booking step 1 options
function renderServices() {
    const listContainer = document.getElementById("services-list-container");
    const optionsContainer = document.getElementById("booking-services-options");
    
    listContainer.innerHTML = "";
    optionsContainer.innerHTML = "";

    state.services.forEach(service => {
        // Public list card
        const card = document.createElement("div");
        card.className = "service-card";
        card.innerHTML = `
            <div class="service-icon"><i data-lucide="${service.icon || 'heart'}"></i></div>
            <h3>${service.name}</h3>
            <p>${service.description}</p>
            <div class="service-meta">
                <div class="service-duration"><i data-lucide="clock"></i> ${service.duration} min</div>
                <div class="service-price"><i data-lucide="credit-card"></i> <span>${service.price}€</span></div>
            </div>
            <a href="#booking" class="btn btn-primary" onclick="selectServiceForBooking('${service.id}')">Reservar Ahora</a>
        `;
        listContainer.appendChild(card);

        // Booking option
        const option = document.createElement("div");
        option.className = "booking-service-option";
        option.dataset.id = service.id;
        option.innerHTML = `
            <div class="option-radio"></div>
            <div class="option-details">
                <h4>${service.name}</h4>
                <p>${service.description.substring(0, 80)}...</p>
            </div>
            <div class="option-meta">
                <div class="option-price">${service.price}€</div>
                <div class="option-duration">${service.duration} min</div>
            </div>
        `;
        option.addEventListener("click", () => selectBookingService(service));
        optionsContainer.appendChild(option);
    });

    if (window.lucide) {
        window.lucide.createIcons();
    }
}

function selectServiceForBooking(serviceId) {
    const s = state.services.find(x => x.id === serviceId);
    if (s) {
        selectBookingService(s);
        // Automatically scroll to wizard
        document.getElementById("booking").scrollIntoView({ behavior: 'smooth' });
    }
}

function selectBookingService(service) {
    bookingData.service = service;
    
    // Highlight UI
    document.querySelectorAll(".booking-service-option").forEach(opt => {
        opt.classList.remove("selected");
        if (opt.dataset.id === service.id) {
            opt.classList.add("selected");
        }
    });

    document.getElementById("goto-step-2").removeAttribute("disabled");
}

// Calendar Generator
let currentCalendarDate = new Date();
const MONTHS_ES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const WORK_HOURS = ["09:00", "10:00", "11:00", "12:00", "13:00", "15:00", "16:00", "17:00", "18:00"];

function renderCalendar() {
    const monthYearLabel = document.getElementById("calendar-month-year");
    const daysGrid = document.getElementById("calendar-days-grid");
    
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    
    monthYearLabel.innerText = `${MONTHS_ES[month]} ${year}`;
    daysGrid.innerHTML = "";

    // Day of the week of first day of month (0 = Sun, 1 = Mon...)
    let firstDayIndex = new Date(year, month, 1).getDay();
    // Adjust to starting on Monday (Mon = 0, Sun = 6)
    firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    const totalDays = new Date(year, month + 1, 0).getDate();

    // Fill blank initial spaces
    for (let i = 0; i < firstDayIndex; i++) {
        const emptyCell = document.createElement("span");
        emptyCell.className = "calendar-day empty";
        daysGrid.appendChild(emptyCell);
    }

    const today = new Date();
    today.setHours(0,0,0,0);

    // Fill days
    for (let day = 1; day <= totalDays; day++) {
        const dayCell = document.createElement("span");
        dayCell.className = "calendar-day";
        dayCell.innerText = day;

        const cellDate = new Date(year, month, day);
        cellDate.setHours(0,0,0,0);

        // Check if date is in the past or Sunday
        if (cellDate < today || cellDate.getDay() === 0) {
            dayCell.classList.add("disabled");
        } else {
            // Check if selected
            const dateStr = formatDateISO(cellDate);
            if (bookingData.date === dateStr) {
                dayCell.classList.add("selected");
            }
            dayCell.addEventListener("click", () => selectBookingDate(dateStr));
        }

        daysGrid.appendChild(dayCell);
    }
}

function selectBookingDate(dateStr) {
    bookingData.date = dateStr;
    bookingData.time = null; // reset time selection
    
    // Refresh calendar rendering
    renderCalendar();
    
    // Load time slots
    const slotsGrid = document.getElementById("time-slots-grid");
    const dateLabel = document.getElementById("selected-date-label");
    
    const d = new Date(dateStr);
    dateLabel.innerText = `${d.getDate()} de ${MONTHS_ES[d.getMonth()]}`;
    slotsGrid.innerHTML = "";

    // Find already booked hours on this day
    const bookedTimes = state.appointments
        .filter(app => app.date === dateStr && app.status !== "cancelled")
        .map(app => app.time);

    WORK_HOURS.forEach(hour => {
        const slot = document.createElement("span");
        slot.className = "time-slot";
        slot.innerText = hour;

        if (bookedTimes.includes(hour)) {
            slot.classList.add("disabled");
        } else {
            slot.addEventListener("click", () => {
                document.querySelectorAll(".time-slot").forEach(s => s.classList.remove("selected"));
                slot.classList.add("selected");
                bookingData.time = hour;
                document.getElementById("goto-step-3").removeAttribute("disabled");
            });
        }

        slotsGrid.appendChild(slot);
    });

    document.getElementById("goto-step-3").setAttribute("disabled", "true");
}

// Helpers
function formatDateISO(date) {
    const offset = date.getTimezoneOffset();
    const d = new Date(date.getTime() - (offset*60*1000));
    return d.toISOString().split('T')[0];
}

function getPrettyDate(dateStr) {
    const [year, month, day] = dateStr.split("-");
    const d = new Date(year, month - 1, day);
    return `${d.getDate()} de ${MONTHS_ES[d.getMonth()]} de ${d.getFullYear()}`;
}

// Wizard Step Navigation
function setupWizard() {
    const steps = document.querySelectorAll(".w-step");
    const contents = document.querySelectorAll(".wizard-content");

    function goToStep(stepNum) {
        steps.forEach(s => {
            const sNum = parseInt(s.dataset.step);
            if (sNum === stepNum) s.className = "w-step active";
            else if (sNum < stepNum) s.className = "w-step completed";
            else s.className = "w-step";
        });

        contents.forEach(c => c.classList.remove("active"));
        document.getElementById(`step-${stepNum}-content`).classList.add("active");

        if (stepNum === 3) {
            // Populate Summary
            document.getElementById("summary-service").innerText = bookingData.service.name;
            document.getElementById("summary-datetime").innerText = `${getPrettyDate(bookingData.date)} a las ${bookingData.time}h`;
            document.getElementById("summary-price").innerText = `${bookingData.service.price}€`;
        }
    }

    document.getElementById("goto-step-2").addEventListener("click", () => {
        renderCalendar();
        goToStep(2);
    });
    document.getElementById("back-to-step-1").addEventListener("click", () => goToStep(1));
    
    document.getElementById("goto-step-3").addEventListener("click", () => goToStep(3));
    document.getElementById("back-to-step-2").addEventListener("click", () => goToStep(2));

    // Calendar Navigation
    document.getElementById("prev-month-btn").addEventListener("click", () => {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
        renderCalendar();
    });
    document.getElementById("next-month-btn").addEventListener("click", () => {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
        renderCalendar();
    });

    // Form Submit
    document.getElementById("booking-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const clientName = document.getElementById("client-name").value;
        const clientEmail = document.getElementById("client-email").value;
        const clientPhone = document.getElementById("client-phone").value;
        const notes = document.getElementById("booking-notes").value;

        // 1. Create or Find Client
        let client = state.clients.find(c => c.email.toLowerCase() === clientEmail.toLowerCase());
        if (!client) {
            client = {
                id: `cli-${Date.now()}`,
                name: clientName,
                email: clientEmail,
                phone: clientPhone,
                notes: []
            };
            await state.saveClient(client);
        }

        // 2. Create Appointment
        const newApp = {
            id: `app-${Date.now()}`,
            clientId: client.id,
            clientName: client.name,
            clientEmail: client.email,
            clientPhone: client.phone,
            serviceId: bookingData.service.id,
            serviceName: bookingData.service.name,
            date: bookingData.date,
            time: bookingData.time,
            price: bookingData.service.price,
            status: "pending",
            notes: notes
        };

        await state.saveAppointment(newApp);

        // 3. Render Success
        document.getElementById("success-booking-code").innerText = `#Z-${newApp.id.substring(newApp.id.length - 4)}`;
        document.getElementById("success-service-name").innerText = newApp.serviceName;
        document.getElementById("success-date-time").innerText = `${getPrettyDate(newApp.date)} a las ${newApp.time}h`;

        contents.forEach(c => c.classList.remove("active"));
        document.getElementById("step-success-content").classList.add("active");
        
        // Mark wizard step 3 as completed too
        steps.forEach(s => s.className = "w-step completed");
    });

    document.getElementById("reset-booking-btn").addEventListener("click", () => {
        // Reset wizard
        bookingData = { service: null, date: null, time: null };
        document.getElementById("booking-form").reset();
        document.getElementById("goto-step-2").setAttribute("disabled", "true");
        document.getElementById("goto-step-3").setAttribute("disabled", "true");
        renderServices();
        goToStep(1);
    });
}

// ==========================================================================
// ADMIN DASHBOARD TAB LOGIC & STATS
// ==========================================================================
function renderAdminDashboard() {
    const todayStr = formatDateISO(new Date());

    // Citas de hoy
    const todayApps = state.appointments.filter(a => a.date === todayStr && a.status !== "cancelled");
    document.getElementById("stats-today-count").innerText = todayApps.length;

    // Clientes activos
    document.getElementById("stats-clients-count").innerText = state.clients.length;

    // Horas completadas (simulamos sumar horas completadas de citas confirmadas/completadas en total)
    const totalHours = state.appointments.filter(a => a.status === "completed" || a.status === "confirmed").length;
    document.getElementById("stats-hours-count").innerText = `${totalHours}h`;

    // Today's list in Dashboard
    const todayList = document.getElementById("dashboard-today-list");
    todayList.innerHTML = "";

    if (todayApps.length === 0) {
        todayList.innerHTML = `<p class="empty-text">No tienes citas agendadas para hoy.</p>`;
    } else {
        // Sort by time
        todayApps.sort((a,b) => a.time.localeCompare(b.time));
        todayApps.forEach(app => {
            const item = document.createElement("div");
            item.className = `app-item-simple ${app.status}`;
            item.innerHTML = `
                <div class="app-item-info">
                    <h4>${app.clientName}</h4>
                    <p>${app.serviceName}</p>
                </div>
                <div class="app-item-time">
                    <span>${app.time}</span>
                    <small>${app.status === 'pending' ? 'Pendiente' : 'Confirmada'}</small>
                </div>
            `;
            todayList.appendChild(item);
        });
    }

    // Clients quick access list
    const clientList = document.getElementById("dashboard-client-list");
    clientList.innerHTML = "";

    // Show top 4 clients
    state.clients.slice(0, 4).forEach(cli => {
        const item = document.createElement("div");
        item.className = "client-quick-item";
        const initials = cli.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
        item.innerHTML = `
            <div class="avatar">${initials}</div>
            <div class="client-quick-info">
                <h4>${cli.name}</h4>
                <p>${cli.email}</p>
            </div>
        `;
        item.addEventListener("click", () => {
            // Navigate to client tab and select client
            switchAdminTab("clients");
            selectAdminClient(cli.id);
        });
        clientList.appendChild(item);
    });
}

function renderAdminAppointments() {
    const tableBody = document.getElementById("appointments-table-body");
    const statusFilter = document.getElementById("filter-appointment-status").value;
    
    tableBody.innerHTML = "";

    // Sort by date then time desc
    const sortedApps = [...state.appointments].sort((a,b) => {
        const comp = b.date.localeCompare(a.date);
        return comp !== 0 ? comp : b.time.localeCompare(a.time);
    });

    const filtered = sortedApps.filter(a => statusFilter === "all" || a.status === statusFilter);

    if (filtered.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--neutral-gray);">No hay citas registradas.</td></tr>`;
        return;
    }

    filtered.forEach(app => {
        const tr = document.createElement("tr");
        
        let statusBadge = "";
        if (app.status === "pending") statusBadge = `<span class="status-indicator pending"><span class="status-dot"></span>Pendiente</span>`;
        else if (app.status === "confirmed") statusBadge = `<span class="status-indicator confirmed"><span class="status-dot"></span>Confirmada</span>`;
        else if (app.status === "completed") statusBadge = `<span class="status-indicator completed"><span class="status-dot"></span>Completada</span>`;
        else statusBadge = `<span class="status-indicator cancelled"><span class="status-dot"></span>Cancelada</span>`;

        let actionButtons = "";
        if (app.status === "pending") {
            actionButtons = `
                <button class="btn-icon-only" title="Confirmar" onclick="changeAppStatus('${app.id}', 'confirmed')"><i data-lucide="check" style="color: var(--success);"></i></button>
                <button class="btn-icon-only btn-danger" title="Cancelar" onclick="changeAppStatus('${app.id}', 'cancelled')"><i data-lucide="x" style="color: var(--danger);"></i></button>
            `;
        } else if (app.status === "confirmed") {
            actionButtons = `
                <button class="btn-icon-only" title="Completar" onclick="changeAppStatus('${app.id}', 'completed')"><i data-lucide="check-check" style="color: var(--primary);"></i></button>
                <button class="btn-icon-only btn-danger" title="Cancelar" onclick="changeAppStatus('${app.id}', 'cancelled')"><i data-lucide="x" style="color: var(--danger);"></i></button>
            `;
        } else {
            actionButtons = `<small style="color: var(--neutral-gray);">No hay acciones</small>`;
        }

        tr.innerHTML = `
            <td>
                <strong>${app.clientName}</strong><br>
                <small>${app.clientPhone}</small>
            </td>
            <td>${app.serviceName}</td>
            <td>
                <strong>${getPrettyDate(app.date)}</strong><br>
                <i data-lucide="clock" style="width: 12px; display: inline; vertical-align: middle;"></i> ${app.time}h
            </td>
            <td>${statusBadge}</td>
            <td>
                <div class="actions-cell">
                    ${actionButtons}
                </div>
            </td>
        `;
        tableBody.appendChild(tr);
    });

    if (window.lucide) {
        window.lucide.createIcons();
    }
}

window.changeAppStatus = async function(appId, newStatus) {
    await state.updateAppointmentStatus(appId, newStatus);
    renderAdminAppointments();
    renderAdminDashboard();
};

// ==========================================================================
// CLIENTS PANEL LOGIC
// ==========================================================================
let selectedClientId = null;

function renderAdminClients() {
    const listContainer = document.getElementById("admin-clients-list");
    const searchVal = document.getElementById("search-clients-input").value.toLowerCase();
    
    listContainer.innerHTML = "";

    const filtered = state.clients.filter(c => 
        c.name.toLowerCase().includes(searchVal) || 
        c.email.toLowerCase().includes(searchVal)
    );

    filtered.forEach(cli => {
        const item = document.createElement("div");
        item.className = `client-list-item ${selectedClientId === cli.id ? 'selected' : ''}`;
        const initials = cli.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
        item.innerHTML = `
            <div class="avatar">${initials}</div>
            <div>
                <strong>${cli.name}</strong><br>
                <small>${cli.email}</small>
            </div>
        `;
        item.addEventListener("click", () => selectAdminClient(cli.id));
        listContainer.appendChild(item);
    });

    if (selectedClientId) {
        renderClientDetail(selectedClientId);
    } else {
        document.getElementById("client-detail-empty").classList.remove("hidden");
        document.getElementById("client-detail-content").classList.add("hidden");
    }
}

function selectAdminClient(clientId) {
    selectedClientId = clientId;
    document.querySelectorAll(".client-list-item").forEach(item => {
        item.classList.remove("selected");
    });
    
    // Highlight in list
    renderAdminClients();
}

function renderClientDetail(clientId) {
    const cli = state.clients.find(c => c.id === clientId);
    const detailEmpty = document.getElementById("client-detail-empty");
    const detailContent = document.getElementById("client-detail-content");

    if (!cli) {
        detailEmpty.classList.remove("hidden");
        detailContent.classList.add("hidden");
        return;
    }

    detailEmpty.classList.add("hidden");
    detailContent.classList.remove("hidden");

    // Client history of appointments
    const cliApps = state.appointments.filter(a => a.clientId === cli.id);

    let appointmentsHtml = "";
    if (cliApps.length === 0) {
        appointmentsHtml = `<p style="color: var(--neutral-gray); font-size: 0.9rem;">No tiene citas agendadas.</p>`;
    } else {
        // Sort newest first
        cliApps.sort((a,b) => b.date.localeCompare(a.date));
        appointmentsHtml = cliApps.map(app => `
            <div style="padding: 10px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); margin-bottom: 8px;">
                <strong>${app.serviceName}</strong> - ${getPrettyDate(app.date)} a las ${app.time}h <br>
                <small>Estado: ${app.status.toUpperCase()} | Tarifa: ${app.price}€</small>
            </div>
        `).join("");
    }

    // Notes history
    let notesHtml = "";
    if (!cli.notes || cli.notes.length === 0) {
        notesHtml = `<p style="color: var(--neutral-gray); font-size: 0.9rem;">No hay notas registradas para este cliente.</p>`;
    } else {
        // Sort notes newest first
        const sortedNotes = [...cli.notes].sort((a,b) => b.date.localeCompare(a.date));
        notesHtml = sortedNotes.map(note => `
            <div class="note-card">
                <div class="note-meta">
                    <span>${getPrettyDate(note.date.split('T')[0])}</span>
                </div>
                <div class="note-text">${note.text}</div>
            </div>
        `).join("");
    }

    detailContent.innerHTML = `
        <div class="client-profile-header">
            <div class="client-profile-info">
                <div class="avatar-large">${cli.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()}</div>
                <div class="client-meta-details">
                    <h2>${cli.name}</h2>
                    <p>
                        <span><i data-lucide="mail" style="width: 14px; display: inline-block;"></i> ${cli.email}</span>
                        <span><i data-lucide="phone" style="width: 14px; display: inline-block;"></i> ${cli.phone}</span>
                    </p>
                </div>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px;">
            <div>
                <h3>Historial de Citas</h3>
                <div style="margin-top: 16px; max-height: 250px; overflow-y: auto;">
                    ${appointmentsHtml}
                </div>
            </div>
            
            <div class="client-notes-section" style="margin-top: 0;">
                <div class="notes-header">
                    <h3>Notas de Sesiones</h3>
                </div>
                
                <div class="notes-timeline" style="max-height: 250px; overflow-y: auto;">
                    ${notesHtml}
                </div>

                <form class="add-note-form" id="add-note-form">
                    <textarea id="new-note-text" placeholder="Añade una nueva nota sobre la evolución del cliente..." required rows="3"></textarea>
                    <button type="submit" class="btn btn-primary btn-sm">Añadir Nota</button>
                </form>
            </div>
        </div>
    `;

    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Attach event to new note
    document.getElementById("add-note-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const text = document.getElementById("new-note-text").value;
        const noteObj = {
            date: new Date().toISOString(),
            text: text
        };

        await state.addClientNote(clientId, noteObj);
        renderClientDetail(clientId);
    });
}

// ==========================================================================
// SERVICES MANAGEMENT
// ==========================================================================
function renderAdminServices() {
    const grid = document.getElementById("admin-services-grid");
    grid.innerHTML = "";

    state.services.forEach(service => {
        const card = document.createElement("div");
        card.className = "service-settings-card";
        card.innerHTML = `
            <div class="service-settings-actions">
                <button class="btn-icon-only" title="Editar" onclick="openEditServiceModal('${service.id}')"><i data-lucide="edit-2"></i></button>
                <button class="btn-icon-only btn-danger" title="Eliminar" onclick="deleteService('${service.id}')"><i data-lucide="trash-2"></i></button>
            </div>
            <div class="service-icon"><i data-lucide="${service.icon || 'heart'}"></i></div>
            <h3>${service.name}</h3>
            <p style="font-size: 0.9rem; color: var(--neutral-gray); margin: 12px 0;">${service.description}</p>
            <div style="font-weight: 500;">
                <span>${service.duration} minutos</span> | 
                <span style="color: var(--primary); font-weight: 600;">${service.price}€</span>
            </div>
        `;
        grid.appendChild(card);
    });

    if (window.lucide) {
        window.lucide.createIcons();
    }
}

window.openEditServiceModal = function(serviceId) {
    const service = state.services.find(s => s.id === serviceId);
    if (service) {
        document.getElementById("service-modal-title").innerText = "Editar Servicio";
        document.getElementById("edit-service-id").value = service.id;
        document.getElementById("new-service-name").value = service.name;
        document.getElementById("new-service-description").value = service.description;
        document.getElementById("new-service-duration").value = service.duration;
        document.getElementById("new-service-price").value = service.price;
        document.getElementById("new-service-icon").value = service.icon || "heart";
        
        openModal("add-service-modal");
    }
};

window.deleteService = async function(serviceId) {
    if (confirm("¿Estás seguro de que deseas eliminar este servicio? No se mostrará más para reservas.")) {
        await state.deleteService(serviceId);
        renderAdminServices();
        renderServices();
    }
};

// ==========================================================================
// SPA TAB NAVIGATION & INITIALIZATION
// ==========================================================================
function switchAdminTab(tabName) {
    document.querySelectorAll(".sidebar-link").forEach(btn => {
        btn.classList.remove("active");
        if (btn.dataset.tab === tabName) btn.classList.add("active");
    });

    document.querySelectorAll(".admin-tab").forEach(tab => {
        tab.classList.remove("active");
    });
    document.getElementById(`tab-${tabName}`).classList.add("active");

    if (tabName === "content-editor") {
        state.populateContentEditorForm();
    }
}

function openModal(modalId) {
    const el = document.getElementById(modalId);
    if (el) {
        el.classList.add("active");
        el.setAttribute("aria-hidden", "false");
    }
}

function closeModal(modalId) {
    const el = document.getElementById(modalId);
    if (el) {
        el.classList.remove("active");
        el.setAttribute("aria-hidden", "true");
    }
}

async function init() {
    // Inicializar datos desde API Backend / DB
    await state.initData();

    // Render Public Layout elements
    renderServices();

    // Navigation triggers
    document.getElementById("admin-login-btn").addEventListener("click", () => {
        if (state.isLoggedIn) {
            showView("admin");
        } else {
            openModal("login-modal");
        }
    });

    document.getElementById("nav-logo-link").addEventListener("click", (e) => {
        e.preventDefault();
        showView("public");
    });

    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", () => {
            showView("public");
        });
    });

    // Mobile Navbar toggle
    const navToggle = document.getElementById("nav-toggle");
    if (navToggle) {
        navToggle.addEventListener("click", () => {
            const isActive = navMenu.classList.toggle("active");
            navToggle.setAttribute("aria-expanded", isActive ? "true" : "false");
        });
    }

    // Admin Sidebar navigation
    document.querySelectorAll(".sidebar-link").forEach(btn => {
        btn.addEventListener("click", (e) => {
            switchAdminTab(e.currentTarget.dataset.tab);
        });
    });

    // Logout
    document.getElementById("admin-logout-btn").addEventListener("click", () => {
        state.isLoggedIn = false;
        showView("public");
    });

    // Modals setup
    document.getElementById("close-login-modal").addEventListener("click", () => closeModal("login-modal"));
    document.getElementById("close-add-client-modal").addEventListener("click", () => closeModal("add-client-modal"));
    document.getElementById("close-add-service-modal").addEventListener("click", () => closeModal("add-service-modal"));
    document.getElementById("close-quick-app-modal").addEventListener("click", () => closeModal("quick-appointment-modal"));

    // Login Form Submit
    document.getElementById("admin-login-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("login-email").value;
        const pass = document.getElementById("login-password").value;

        if (email === "zoyla@bienestar.com" && pass === "zoyla123") {
            state.isLoggedIn = true;
            closeModal("login-modal");
            showView("admin");
        } else {
            alert("Credenciales incorrectas de demostración.");
        }
    });

    // Client Add Form Submit
    document.getElementById("btn-add-client").addEventListener("click", () => {
        document.getElementById("add-client-form").reset();
        openModal("add-client-modal");
    });

    document.getElementById("add-client-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("new-client-name").value;
        const email = document.getElementById("new-client-email").value;
        const phone = document.getElementById("new-client-phone").value;

        const newCli = {
            id: `cli-${Date.now()}`,
            name,
            email,
            phone,
            notes: []
        };

        await state.saveClient(newCli);
        closeModal("add-client-modal");
        renderAdminClients();
        renderAdminDashboard();
    });

    // Client Search Filter
    document.getElementById("search-clients-input").addEventListener("input", renderAdminClients);

    // Filter appointments
    document.getElementById("filter-appointment-status").addEventListener("change", renderAdminAppointments);

    // Quick Manual Appointment
    document.getElementById("btn-quick-new-appointment").addEventListener("click", () => {
        const clientSelect = document.getElementById("quick-app-client");
        const serviceSelect = document.getElementById("quick-app-service");

        clientSelect.innerHTML = state.clients.map(c => `<option value="${c.id}">${c.name}</option>`).join("");
        serviceSelect.innerHTML = state.services.map(s => `<option value="${s.id}">${s.name} (${s.price}€)</option>`).join("");

        document.getElementById("quick-app-form").reset();
        openModal("quick-appointment-modal");
    });

    document.getElementById("quick-app-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const clientId = document.getElementById("quick-app-client").value;
        const serviceId = document.getElementById("quick-app-service").value;
        const date = document.getElementById("quick-app-date").value;
        const time = document.getElementById("quick-app-time").value;

        const client = state.clients.find(c => c.id === clientId);
        const service = state.services.find(s => s.id === serviceId);

        const newApp = {
            id: `app-${Date.now()}`,
            clientId,
            clientName: client.name,
            clientEmail: client.email,
            clientPhone: client.phone,
            serviceId,
            serviceName: service.name,
            date,
            time,
            price: service.price,
            status: "confirmed",
            notes: "Creada manualmente desde el panel de administración."
        };

        await state.saveAppointment(newApp);
        closeModal("quick-appointment-modal");
        
        renderAdminAppointments();
        renderAdminDashboard();
    });

    // Service Add Form Submit
    document.getElementById("btn-add-service").addEventListener("click", () => {
        document.getElementById("service-modal-title").innerText = "Añadir Nuevo Servicio";
        document.getElementById("edit-service-id").value = "";
        document.getElementById("add-service-form").reset();
        openModal("add-service-modal");
    });

    document.getElementById("add-service-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = document.getElementById("edit-service-id").value;
        const name = document.getElementById("new-service-name").value;
        const description = document.getElementById("new-service-description").value;
        const duration = parseInt(document.getElementById("new-service-duration").value);
        const price = parseInt(document.getElementById("new-service-price").value);
        const icon = document.getElementById("new-service-icon").value;

        if (id) {
            // Edit mode
            const updatedService = { id, name, description, duration, price, icon };
            await state.saveService(updatedService, true);
        } else {
            // Add mode
            const newService = {
                id: `serv-${Date.now()}`,
                name,
                description,
                duration,
                price,
                icon
            };
            await state.saveService(newService, false);
        }

        closeModal("add-service-modal");
        renderAdminServices();
        renderServices();
    });

    // Content Editor Form Submit (CMS para Zoyla)
    const contentForm = document.getElementById("content-editor-form");
    if (contentForm) {
        contentForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const newContent = {
                heroBadge: document.getElementById("cms-hero-badge").value,
                heroTitle: document.getElementById("cms-hero-title").value,
                heroSubtitle: document.getElementById("cms-hero-subtitle").value,
                aboutTitle: document.getElementById("cms-about-title").value,
                aboutLead: document.getElementById("cms-about-lead").value,
                aboutBody: document.getElementById("cms-about-body").value,
                aboutQuote: document.getElementById("cms-about-quote").value,
                diagTitle: document.getElementById("cms-diag-title").value,
                diagSubtitle: document.getElementById("cms-diag-subtitle").value,
                servicesTitle: document.getElementById("cms-services-title").value,
                bookingTitle: document.getElementById("cms-booking-title").value
            };
            await state.saveSiteContent(newContent);
            alert("¡Textos de la web actualizados con éxito!");
        });
    }

    // Wizard
    setupWizard();
}

window.addEventListener("DOMContentLoaded", init);
