$(document).ready(function () {
    $("#searchInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#courseTable tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
    $("body").on("click", "#courseTable tr", function () {
        updateModal(String($(this).attr("name")));
    });
});
$('#myModal').on('shown.bs.modal', function () {
    $('#myInput').trigger('focus')
})
$('#subjectSelection').on('change', function () {
    $("#courseList").addClass("d-none");
    $("#courseTable tr").remove();
    $("#searchInput").val('');
    service("GetCoursesBySubject", "{ subject:" + "\"" + this.value + "\"" + "}",
        function (response) {
            for (var i = 0; i < response.courseSections.length; i++) {
                var course = response.courseSections[i];
                var tr = document.createElement("tr");
                tr.setAttribute("name", course.courseId);
                var td1 = document.createElement("td");
                $(td1).text(course.courseCode);
                $(tr).append(td1);
                var td2 = document.createElement("td");
                $(td2).text(course.courseTitle);
                $(tr).append(td2);
                var td3 = document.createElement("td");
                $(td3).text(course.creditHoursDesc);
                $(tr).append(td3);
                var td4 = document.createElement("td");
                var instructor = course.instructors[0];
                if (instructor) {
                    $(td4).text(instructor.nameLast + ", " + instructor.nameFirst);
                } else {
                    $(td4).text("tba");
                }
                $(tr).append(td4);

                $("#courseTable").append(tr);
                $("#courseList").removeClass("d-none");
            }

        }, function (response) {
            alert("Error...");
            console.log(response);
        });
});

function updateModal(crn) {
    service("GetCoursesByCRN", "{ crn:" + "\"" + crn + "\"" + "}",
        function (response) {
            var specificCourse = response.courseSections[0];
            var courseSchedules = specificCourse.courseSchedules;
            var flag = 0;
            if (courseSchedules) {
                for (var j = 0; j < courseSchedules.length; j++) {
                    var s = courseSchedules[j];
                    if (s.scheduleTypeDescription == "Final Exam") {
                        $("#time").text(s.days + " " + toStandard(s.startTime) + " - " + toStandard(s.endTime) + " - " + formatDate(s.startDate) + " To " + formatDate(s.endDate) + " - " + s.room + " " + s.buildingName);
                        flag = 1;
                    }
                }
            }
            if (flag = 0) {
                $("#time").text("None");
            }
            console.log(specificCourse);
            $("#summary").text(specificCourse.courseDescription);
            $("#modal-title").text(specificCourse.courseCode);
            $('#myModal').modal("show");
        }, function (response) {
            alert("Error...");
            console.log(response);
        });
}
function formatDate(date) {
    var formatdate = new Date(date);
    return (formatdate.getMonth()+1) + '/' + (formatdate.getDate()+1) + '/' + formatdate.getFullYear();
}
function toStandard(militaryTime) {
    militaryTime = militaryTime.split(':');
    return (militaryTime[0].charAt(0) == 1 && militaryTime[0].charAt(1) > 2) ? (militaryTime[0] - 12) + ':' + militaryTime[1] + ' PM' : militaryTime.join(':') + ' AM'
}