const btn = document.getElementById('open-menu-btn');
const menu = document.querySelector('.menu-opened');
let menuLeft = -158;
let opened = false;
menu.style.left=`${menuLeft}px`
btn.addEventListener('click',()=>{
	if(opened===false){
		menu.style.left=`${menuLeft+218}px`
		opened=true;
		btn.innerHTML='';
		btn.innerHTML=`<i class="fa fa-angle-left" aria-hidden="true"></i>`
	}else{
		menu.style.left=`${menuLeft}px`
		opened=false;
		btn.innerHTML='';
		btn.innerHTML=`<i class="fa fa-angle-right" aria-hidden="true"></i>`
	}
	
})


//




let ctx = document.getElementById('lineChart').getContext('2d');
let myLineChart = new Chart(ctx, {
    type: 'line',
    data: {
            
            datasets:[
            {      
                 label: 'clicks',
                backgroundColor: '#fbcf71',
                borderColor: '#fbcf71',
                data: [19, 59, 21, -40, -30, 25, 57],
                pointBorderColor:" #30363e",
                pointRadius: 4,
                fill:false,
             
                },
                { label: 'Page view',
                backgroundColor: '#1f7bb6',
                borderColor: '#1f7bb6',
                data: [-38, 22, 59, 19, -37, -30, 20],
                pointBorderColor:" #30363e",
                 pointRadius: 4,
                fill:false,
                
                },
                {label: 'Sign ups',
                backgroundColor: '#069999',
                borderColor: '#069999',
                data: [40, 50, 0, -40,-20, 40, 57],
                pointBorderColor:" #30363e",
                 pointRadius: 4,
                fill:false,

                }
            ],
        
               labels: ["", "", "", "", "", ""],
    },
    options : { 
    legend  :{

        position: 'bottom',
        align: 'end',
        labels: {
              boxWidth: 13,
              fontColor:'#ffffff',
          }
    } 
    }
});


let ctxdoughnut = document.getElementById('doughnutChart').getContext('2d');
let myDoughnutChart = new Chart(ctxdoughnut, {
    type: 'doughnut',
    data: {
         labels: ["Total Views", "Total Clicks", "Signups"],
            datasets:[{      
               
                backgroundColor: ["#fbcf71", "#1f7bb6","#069999"],
                data: [200,65,22],
                
             borderWidth: 0,

             
                }],
        
              
    },
    options : { 
        
     cutoutPercentage: 70,

     legend  :{
         // orient: 'vertical',
        position: 'bottom',
        align: 'start',
     
         labels: {
            boxWidth:10,
            fontSize:12,
             fontColor:'#ffffff',
               usePointStyle:true,
               padding: 15,
               
          }
       
    }
    }
});



am4core.ready(function() {

// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

var continents = {
  "AF": 0,
  "AN": 1,
  "AS": 2,
  "EU": 3,
  "NA": 4,
  "OC": 5,
  "SA": 6
}

// Create map instance
var chart = am4core.create("chartdiv", am4maps.MapChart);
chart.projection = new am4maps.projections.Miller();

// Create map polygon series for world map
var worldSeries = chart.series.push(new am4maps.MapPolygonSeries());
worldSeries.useGeodata = true;
worldSeries.geodata = am4geodata_worldLow;
worldSeries.exclude = ["AQ"];

var worldPolygon = worldSeries.mapPolygons.template;
worldPolygon.tooltipText = "{name}";
worldPolygon.nonScalingStroke = true;
worldPolygon.strokeOpacity = 0.5;
worldPolygon.fill = am4core.color("#eee");
worldPolygon.propertyFields.fill = "color";

var hs = worldPolygon.states.create("hover");
hs.properties.fill = chart.colors.getIndex(9);


// Create country specific series (but hide it for now)
var countrySeries = chart.series.push(new am4maps.MapPolygonSeries());
countrySeries.useGeodata = true;
countrySeries.hide();
countrySeries.geodataSource.events.on("done", function(ev) {
  worldSeries.hide();
  countrySeries.show();
});

var countryPolygon = countrySeries.mapPolygons.template;
countryPolygon.tooltipText = "{name}";
countryPolygon.nonScalingStroke = true;
countryPolygon.strokeOpacity = 0.5;
countryPolygon.fill = am4core.color("#eee");

var hs = countryPolygon.states.create("hover");
hs.properties.fill = chart.colors.getIndex(9);

// Set up click events
worldPolygon.events.on("hit", function(ev) {
  ev.target.series.chart.zoomToMapObject(ev.target);
  var map = ev.target.dataItem.dataContext.map;
  if (map) {
    ev.target.isHover = false;
    countrySeries.geodataSource.url = "https://www.amcharts.com/lib/4/geodata/json/" + map + ".json";
    countrySeries.geodataSource.load();
  }
});

// Set up data for countries
var data = [];
for(var id in am4geodata_data_countries2) {
  if (am4geodata_data_countries2.hasOwnProperty(id)) {
    var country = am4geodata_data_countries2[id];
    if (country.maps.length) {
      data.push({
        id: id,
        color: chart.colors.getIndex(continents[country.continent_code]),
        map: country.maps[0]
      });
    }
  }
}
worldSeries.data = data;

// Zoom control
chart.zoomControl = new am4maps.ZoomControl();

var homeButton = new am4core.Button();
homeButton.events.on("hit", function() {
  worldSeries.show();
  countrySeries.hide();
  chart.goHome();
});

homeButton.icon = new am4core.Sprite();
homeButton.padding(7, 5, 7, 5);
homeButton.width = 30;
homeButton.icon.path = "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8";
homeButton.marginBottom = 10;
homeButton.parent = chart.zoomControl;
homeButton.insertBefore(chart.zoomControl.plusButton);

});