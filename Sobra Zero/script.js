// Mostrar sección seleccionada
function mostrarSeccion(seccion) {
    document.querySelectorAll('.seccion').forEach(s => s.style.display = 'none');
    document.getElementById(seccion).style.display = 'block';
  }
  
  // Cargar datos de localStorage
  let inventario = JSON.parse(localStorage.getItem('inventario')) || [];
  let redistribucion = JSON.parse(localStorage.getItem('redistribucion')) || [];
  
  // Inventario
  document.getElementById('formInventario').addEventListener('submit', function(e) {
    e.preventDefault();
    const producto = document.getElementById('productoInv').value;
    const cantidad = parseFloat(document.getElementById('cantidadInv').value);
    const estado = document.getElementById('estadoInv').value;
    
    inventario.push({ producto, cantidad, estado, fecha: new Date() });
    localStorage.setItem('inventario', JSON.stringify(inventario));
    mostrarInventario();
    this.reset();
  });
  
  function mostrarInventario() {
    const lista = document.getElementById('listaInventario');
    lista.innerHTML = '<h3>Inventario Registrado</h3>' + inventario.map(i => 
      `<p>${i.producto} - ${i.cantidad} kg/platos (${i.estado}) - ${new Date(i.fecha).toLocaleDateString()}</p>`
    ).join('');
  }
  mostrarInventario();
  
  // Redistribución
  document.getElementById('formRedistribucion').addEventListener('submit', function(e) {
    e.preventDefault();
    const producto = document.getElementById('productoRed').value;
    const cantidad = parseFloat(document.getElementById('cantidadRed').value);
    const tipo = document.getElementById('tipoRed').value;
    const accion = document.getElementById('accionRed').value;
    
    redistribucion.push({ producto, cantidad, tipo, accion, estado: 'Pendiente', fecha: new Date() });
    localStorage.setItem('redistribucion', JSON.stringify(redistribucion));
    mostrarRedistribucion();
    this.reset();
  });
  
  function mostrarRedistribucion() {
    const lista = document.getElementById('listaRedistribucion');
    lista.innerHTML = '<h3>Sobras Registradas</h3>' + redistribucion.map((r, index) => 
      `<p>${r.producto} - ${r.cantidad} (${r.tipo}) - ${r.accion} - ${r.estado} 
        ${r.estado === 'Pendiente' ? `<button onclick="marcarCompletado(${index})">Marcar Completado</button>` : ''}</p>`
    ).join('');
  }
  mostrarRedistribucion();
  
  function marcarCompletado(index) {
    redistribucion[index].estado = 'Completado';
    localStorage.setItem('redistribucion', JSON.stringify(redistribucion));
    mostrarRedistribucion();
    actualizarEstadisticas();
  }
  
  // Optimización
  function actualizarEstadisticas() {
    let totalRegistrado = inventario.reduce((sum, i) => sum + i.cantidad, 0);
    let desperdicioReducido = redistribucion
      .filter(r => r.estado === 'Completado')
      .reduce((sum, r) => sum + r.cantidad, 0);
    
    const porcentaje = (desperdicioReducido / totalRegistrado) * 100 || 0;
    const sugerencia = porcentaje > 20 ? 'Reducir compras en un 10%.' : 'Mantener compras actuales.';
  
    document.getElementById('totalRegistrado').textContent = totalRegistrado;
    document.getElementById('desperdicioReducido').textContent = desperdicioReducido;
    document.getElementById('sugerencia').textContent = sugerencia;
  }
  
  // Educación
  document.getElementById('formPorciones').addEventListener('submit', function(e) {
    e.preventDefault();
    const clientes = parseInt(document.getElementById('clientes').value);
    const ingrediente = document.getElementById('ingrediente').value;
    const cantidadPorPersona = parseFloat(document.getElementById('cantidadPorPersona').value);
    const totalSugerido = clientes * cantidadPorPersona;
  
    document.getElementById('resultadoPorciones').innerHTML = 
      `<p>Total Sugerido: ${totalSugerido} kg de ${ingrediente}</p>`;
    this.reset();
  });
  
  // Mostrar Inventario por defecto
  mostrarSeccion('inventario');