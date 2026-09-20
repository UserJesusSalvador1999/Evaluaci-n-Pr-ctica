document.addEventListener("DOMContentLoaded", function() {

    // 1. CARRUSEL
    const carruselPrincipalElemento = document.getElementById('carruselPrincipal');
    if (carruselPrincipalElemento && typeof bootstrap !== 'undefined') {
        new bootstrap.Carousel(carruselPrincipalElemento, {
            interval: 5000, 
            pause: 'hover'  
        });
    }

    // 2. CALENDARIO
    const mesActualUI = document.getElementById('mes-actual');
    const contenedorDias = document.getElementById('dias-calendario');
    const btnAnterior = document.getElementById('mes-anterior');
    const btnSiguiente = document.getElementById('mes-siguiente');

    const nombresMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    let fechaNavegacion = new Date(2026, 8, 19); 

    function renderizarCalendario() {
        if (!contenedorDias) return;

        const año = fechaNavegacion.getFullYear();
        const mes = fechaNavegacion.getMonth();

        if (mesActualUI) mesActualUI.textContent = `${nombresMeses[mes]} ${año}`;
        contenedorDias.innerHTML = '';

        const primerDiaDelMes = new Date(año, mes, 1).getDay();
        const diasEnMes = new Date(año, mes + 1, 0).getDate();
        const diasMesAnterior = new Date(año, mes, 0).getDate();

        for (let i = primerDiaDelMes; i > 0; i--) {
            const divDia = document.createElement('div');
            divDia.className = 'dia-celda texto-muted'; 
            divDia.textContent = diasMesAnterior - i + 1;
            contenedorDias.appendChild(divDia);
        }

        const hoy = new Date();
        const esMesActual = (hoy.getMonth() === mes && hoy.getFullYear() === año);

        for (let i = 1; i <= diasEnMes; i++) {
            const divDia = document.createElement('div');
            divDia.className = 'dia-celda';
            
            if (esMesActual && i === hoy.getDate()) divDia.classList.add('dia-hoy');
            
            divDia.textContent = i;
            divDia.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevenir que el clic en el día cierre el menú
                const previos = document.querySelectorAll('.dia-celda.dia-seleccionado');
                previos.forEach(el => el.classList.remove('dia-seleccionado'));
                this.classList.add('dia-seleccionado');
            });
            contenedorDias.appendChild(divDia);
        }

        const celdasFaltantes = 42 - contenedorDias.children.length; 
        for (let i = 1; i <= celdasFaltantes; i++) {
            const divDia = document.createElement('div');
            divDia.className = 'dia-celda texto-muted';
            divDia.textContent = i;
            contenedorDias.appendChild(divDia);
        }
    }

    if(contenedorDias && btnAnterior && btnSiguiente) {
        btnAnterior.addEventListener('click', function(e) {
            e.stopPropagation(); 
            fechaNavegacion.setMonth(fechaNavegacion.getMonth() - 1);
            renderizarCalendario();
        });
        btnSiguiente.addEventListener('click', function(e) {
            e.stopPropagation(); 
            fechaNavegacion.setMonth(fechaNavegacion.getMonth() + 1);
            renderizarCalendario();
        });
        renderizarCalendario();
    }

    // 3. TAREAS
    const checkboxesTareas = document.querySelectorAll('.checkbox-tarea');
    const barraProgreso = document.getElementById('barra-progreso');
    const textoProgreso = document.getElementById('texto-progreso');

    function actualizarProgreso() {
        if (!barraProgreso || !textoProgreso) return;
        const totalTareas = checkboxesTareas.length;
        const tareasCompletadas = document.querySelectorAll('.checkbox-tarea:checked').length;
        let porcentaje = totalTareas > 0 ? Math.round((tareasCompletadas / totalTareas) * 100) : 0;
        barraProgreso.style.width = porcentaje + '%';
        textoProgreso.textContent = porcentaje + '%';
    }

    checkboxesTareas.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const contenedorTarea = this.closest('.list-group-item');
            if (this.checked) contenedorTarea.classList.add('tarea-completada');
            else contenedorTarea.classList.remove('tarea-completada');
            actualizarProgreso();
        });
    });

    // 4. MODAL DE GUARDAR
    const btnGuardarModal = document.getElementById('btnGuardarModal');
    if (btnGuardarModal) {
        btnGuardarModal.addEventListener('click', function() {
            const textoOriginal = this.textContent;
            this.textContent = 'Guardando...';
            this.disabled = true;

            setTimeout(() => {
                alert("¡Tu progreso de materias ha sido guardado exitosamente!");
                this.textContent = textoOriginal;
                this.disabled = false;
                const modalElement = document.getElementById('modalSheetGuardar');
                if (modalElement && typeof bootstrap !== 'undefined') {
                    bootstrap.Modal.getInstance(modalElement).hide();
                }
            }, 1000);
        });
    }

    // 5. CHART.JS (DASHBOARD)
    const ctx = document.getElementById('miGraficaDashboard');
    if (ctx && typeof Chart !== 'undefined') {
        Chart.defaults.color = '#6c757d'; 
        Chart.defaults.font.family = "'Inter', sans-serif";

        new Chart(ctx, {
            type: 'line', 
            data: {
                labels: ['Semestre 1', 'Semestre 2', 'Semestre 3', 'Semestre 4', 'Semestre 5', 'Actual'],
                datasets: [{
                    label: 'Promedio General',
                    data: [78.5, 80.2, 79.8, 81.5, 82.1, 82.38], 
                    borderColor: '#0d6efd',       
                    borderWidth: 3,               
                    pointBackgroundColor: '#0d6efd', 
                    pointBorderColor: '#0d6efd',  
                    pointRadius: 5,               
                    pointHoverRadius: 7,          
                    tension: 0,                   
                    fill: false                   
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, 
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        titleFont: { size: 14 },
                        bodyFont: { size: 14, weight: 'bold' },
                        displayColors: false, 
                        callbacks: {
                            label: function(context) { return 'Promedio: ' + context.parsed.y; }
                        }
                    }
                },
                scales: {
                    x: { grid: { display: false, drawBorder: false } },
                    y: { grid: { color: '#343a40', drawBorder: false }, min: 75, max: 85 }
                }
            }
        });
    }

});