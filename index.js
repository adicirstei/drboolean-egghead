
const Task = require('data.task')
const Api = require('./api')

const {List} = require('immutable-ext')


const argv = new Task((rej, res) => res(process.argv))
const names = argv.map(args => args.slice(2))

const Intersection = xs => 
({
  xs,
  concat: ({xs: ys}) =>
    Intersection(xs.filter(x => ys.some(y => x === y)))
})



const related = name => 
  Api.findArtist(name)
  .map(artist => artist.id)
  .chain(Api.relatedArtists)
  .map(artists => artists.map(artist => artist.name))

const artistIntersection = rels => 
  rels.foldMap(Intersection)
  .toList()

const main = (names) =>
  List(names)
  .traverse(Task.of, related)

  
names.chain(main).fork(console.error, console.log)