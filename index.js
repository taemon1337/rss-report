let podcatcher = require('podcatcher');
let request = require('request').defaults({ encoding: null });
let feed = process.argv[2] || 'http://feeds.twit.tv/sn.xml';
let year = new Date().getFullYear();
let totals = { title: null, description: null, shows: 0, oldest: null, newest: null, minutes: 0, images: null }
let records = []
let meta = null
let durationDefault = '1:00:00' // some shows do not have a duration listed, so assume 1 hr

let parseDuration = function(show) {
  let dur = durationDefault
  if (show['itunes:duration']) {
    dur = show['itunes:duration']['#'] || durationDefault
  }
  let p = dur.split(':')
  if (p.length == 3) {
    let h = parseInt(p[0])
    let m = parseInt(p[1])
    let s = parseInt(p[2])
    return Math.floor((h * 60 * 60 + m * 60 + s) / 60); // return duration in seconds
  } else {
    throw new Error('Could not parse duration', dur)
  }
}

let stat = function (show) {
  let dur = parseDuration(show)
  records.push({ title: show.title, date: show.date, duration: dur })
  totals.shows += 1
  totals.minutes += dur

  if (totals.oldest === null || show.date < totals.oldest) {
    totals.oldest = show.date
  }

  if (totals.newest === null || show.date > totals.newest) {
    totals.newest = show.date
  }
}

let buildImage = function () {
  let title = totals.title || feed;
  let desc = totals.description || '';
  let div = '<div class="media mt-3">'
  div += '<img height="250" class="d-flex mr-3" src="' + totals.image + '" alt="' + title + '">';
  div += '<div class="media-body"><h5 class="mt-0">' + title + '</h5>' + desc + '</div>';
  return div + '</div>'
}

let buildTotals = function () {
  let dur = Math.floor(totals.minutes / 60) + ":" + Math.floor(totals.minutes % 60)
  let oldest = totals.oldest.toDateString()
  let newest = totals.newest.toDateString()

  let table = '<table class="table"><tbody>'
  table += '<tr><th>Show Title</th><td>' + (totals.title || feed) + '</td></tr>'
  table += '<tr><th>Show Count</th><td>' + totals.shows + '</td></tr>'
  table += '<tr><th>Oldest Show</th><td>' + oldest + '</td></tr>'
  table += '<tr><th>Newest Show</th><td>' + newest + '</td></tr>'
  table += '<tr><th>Total Duration</th><td>' + dur + '</td></tr>'
  return table += '</tbody></table>'
}

let buildTable = function () {
  let table = '<table class="table table-striped table-sm"><thead><tr><th>Title</th><th>Date</th><th>Duration (minutes)</th></thead><tbody>'
  records.forEach(function (record) {
    table += '<tr><td>' + [record.title, record.date.toDateString(), record.duration].join('</td><td>') + '</td></tr>'
  })
  return table + '</tbody></table>'
}

let buildHead = function () {
  let head = '<head><title>' + (totals.title || feed) + '</title>'
  head += '<link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ" crossorigin="anonymous">'
  return head
}

let printTable = function () {
  let head = buildHead()
  let html = '<html>' + head + '<body><div class="container-fluid"><div class="row justify-content-center"><div class="col-8">'
  if (totals.image) {
    html += buildImage()
  }

  html += buildTotals()
  html += '<br>'
  html += buildTable()
  html += '</div></div></div></body></html>'
  console.log(html)
}


podcatcher.getAll(feed, function (err, metadata, articles) {
  if (err) return console.error('Error: ', err)
  totals.title = metadata.title
  totals.description = metadata.description

  request.get(metadata.image.url, {}, function (err, resp, body) {
    if (!err && resp.statusCode == 200) {
      totals.image = "data:" + resp.headers['content-type'] + ';base64,' + new Buffer(body).toString('base64');
    }

    articles.forEach(function (show) {
      if (show.date.getFullYear() === year) {
        stat(show)
      }
    })
    printTable()
  })
})



