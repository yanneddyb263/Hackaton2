// Chart.js helper module for EcoCycle CI
export function createCategoryBreakdownChart(canvasId, wasteData) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    // Destroy existing chart if it exists to prevent memory leaks/re-render glitch
    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
        existingChart.destroy();
    }

    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Plastic', 'Cardboard', 'Metal', 'Used Oil', 'Mixed & Hazardous'],
            datasets: [{
                data: wasteData,
                backgroundColor: [
                    '#0D9F6E', // Plastic Green
                    '#3B82F6', // Cardboard Blue
                    '#F59E0B', // Metal Orange/Yellow
                    '#8B5CF6', // Oil Purple
                    '#EF4444'  // Mixed/Hazardous Red
                ],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 12,
                        font: {
                            family: 'Inter',
                            size: 12
                        }
                    }
                }
            },
            cutout: '65%'
        }
    });
}

export function createWasteTrendChart(canvasId, labelData, valueData) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
        existingChart.destroy();
    }

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labelData,
            datasets: [{
                label: 'Waste Volume (kg)',
                data: valueData,
                backgroundColor: 'rgba(13, 159, 110, 0.85)',
                borderRadius: 6,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#F1F5F9'
                    },
                    ticks: {
                        font: {
                            family: 'Inter'
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: 'Inter'
                        }
                    }
                }
            }
        }
    });
}

export function createRevenueTrendChart(canvasId, labelData, revenueData) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
        existingChart.destroy();
    }

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: labelData,
            datasets: [{
                label: 'Revenue (FCFA)',
                data: revenueData,
                borderColor: '#2563EB',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                fill: true,
                tension: 0.35,
                borderWidth: 3,
                pointRadius: 4,
                pointBackgroundColor: '#2563EB'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    grid: {
                        color: '#F1F5F9'
                    },
                    ticks: {
                        font: {
                            family: 'Inter'
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: 'Inter'
                        }
                    }
                }
            }
        }
    });
}
