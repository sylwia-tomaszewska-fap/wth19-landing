
function makePrelekcjeByTimeSlot(data) {
    categories = (data[0].categories)

    list = []
    slots = []

    //lectures-list
    for (i = 0; i < categories.length; i++) {
        for (j = 0; j < categories[i].lectures.length; j++) {
            lecture = categories[i].lectures[j];
            lecture.categoryIcon = categories[i].categoryIcon;
            lecture.categoryName = categories[i].categoryName;
            list.push(lecture);
        }
    }

    //making slots
    for (i = 0; i < list.length; i++) {      
        added = false;

        slots.map(function (slot) { 
            if (slot.startDate == list[i].startDate && slot.endDate == list[i].endDate && list[i].subject!="Obiad") {                                
                // console.log(list[i].subject)
                slot.lectures.push(list[i]);
                added = true;
            } 
        });
        
        if (!added ) {            
            slots.push({ startDate: list[i].startDate, endDate: list[i].endDate, lectures: [] });
            lastSlot = slots[slots.length - 1];
            lastSlot.lectures.push(list[i]);
        }
    }

    return slots
};