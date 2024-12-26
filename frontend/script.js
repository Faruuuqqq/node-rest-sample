const API_URLS = {
    students: "http://localhost:3000/api/students",
    lecturers: "http://localhost:3000/api/lecturers",
    teachers: "http://localhost:3000/api/teachers",
};

$(document).ready(() => {
    const fetchAndRender = (entity) => {
        $.get(API_URLS[entity], (data) => {
            const tableBody = $(`#${entity}-table tbody`);
            tableBody.empty();
            data.forEach((item) => {
                const { id, name, age, major, department, specialization, grade, subject } = item;
                let actions = `
                    <button class="update" data-id="${id}" data-entity="${entity}">Update</button>
                    <button class="delete" data-id="${id}" data-entity="${entity}">Delete</button>
                `;

                let rowContent = `<td>${id}</td><td>${name}</td>`;
                if (entity === "students") rowContent += `<td>${age}</td><td>${major}</td>`;
                if (entity === "lecturers") rowContent += `<td>${department}</td><td>${specialization}</td>`;
                if (entity === "teachers") rowContent += `<td>${grade}</td><td>${subject}</td>`;

                tableBody.append(`<tr>${rowContent}<td>${actions}</td></tr>`);
            });
        });
    };

    const addEntity = (entity, data) => {
        $.ajax({
            url: API_URLS[entity],
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: () => {
                alert(`${entity.charAt(0).toUpperCase() + entity.slice(1)} added successfully!`);
                fetchAndRender(entity);
            },
        });
    };

    const deleteEntity = (entity, id) => {
        $.ajax({
            url: `${API_URLS[entity]}/${id}`,
            type: "DELETE",
            success: () => {
                alert(`${entity.charAt(0).toUpperCase() + entity.slice(1)} deleted successfully!`);
                fetchAndRender(entity);
            },
        });
    };

    const updateEntity = (entity, id, data) => {
        $.ajax({
            url: `${API_URLS[entity]}/${id}`,
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: () => {
                alert(`${entity.charAt(0).toUpperCase() + entity.slice(1)} updated successfully!`);
                fetchAndRender(entity);
            },
        });
    };

    // Fetch all data initially
    fetchAndRender("students");
    fetchAndRender("lecturers");
    fetchAndRender("teachers");

    // Add event listeners
    $("#add-student").click(() => {
        const data = {
            name: $("#student-name").val(),
            age: $("#student-age").val(),
            major: $("#student-major").val(),
        };
        addEntity("students", data);
    });

    $("#add-lecturer").click(() => {
        const data = {
            name: $("#lecturer-name").val(),
            department: $("#lecturer-department").val(),
            specialization: $("#lecturer-specialization").val(),
        };
        addEntity("lecturers", data);
    });

    $("#add-teacher").click(() => {
        const data = {
            name: $("#teacher-name").val(),
            grade: $("#teacher-grade").val(),
            subject: $("#teacher-subject").val(),
        };
        addEntity("teachers", data);
    });

    // Handle delete and update
    $(document).on("click", ".delete", function () {
        const id = $(this).data("id");
        const entity = $(this).data("entity");
        deleteEntity(entity, id);
    });

    $(document).on("click", ".update", function () {
        const id = $(this).data("id");
        const entity = $(this).data("entity");

        const updatedData = {};
        if (entity === "students") {
            updatedData.name = prompt("Enter new name:");
            updatedData.age = prompt("Enter new age:");
            updatedData.major = prompt("Enter new major:");
        }
        if (entity === "lecturers") {
            updatedData.name = prompt("Enter new name:");
            updatedData.department = prompt("Enter new department:");
            updatedData.specialization = prompt("Enter new specialization:");
        }
        if (entity === "teachers") {
            updatedData.name = prompt("Enter new name:");
            updatedData.grade = prompt("Enter new grade:");
            updatedData.subject = prompt("Enter new subject:");
        }

        updateEntity(entity, id, updatedData);
    });

    // Tab navigation
    $(".tab-link").click(function () {
        $(".tab-link").removeClass("active");
        $(this).addClass("active");

        $(".tab-content").removeClass("active");
        $(`#${$(this).data("tab")}`).addClass("active");
    });
});
