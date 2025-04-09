import { useNavigate } from 'react-router-dom'

export default function ClassicStories() {
  const navigate = useNavigate()

  const classicStories = [
    {
      id: 1,
      title: "The Three Little Pigs",
      image: "https://placehold.co/400x300/FF6B6B/FFFFFF?text=Three+Little+Pigs",
      description: "A tale of hard work and clever thinking"
    },
    {
      id: 2,
      title: "Little Red Riding Hood",
      image: "https://placehold.co/400x300/4ECDC4/FFFFFF?text=Red+Riding+Hood",
      description: "A story about bravery and family love"
    },
    {
      id: 3,
      title: "The Tortoise and the Hare",
      image: "https://placehold.co/400x300/FFE66D/2C3E50?text=Tortoise+and+Hare",
      description: "A lesson in patience and determination"
    },
    {
      id: 4,
      title: "Goldilocks and the Three Bears",
      image: "https://placehold.co/400x300/FF6B6B/FFFFFF?text=Goldilocks",
      description: "A story about respect and consequences"
    },
    {
      id: 5,
      title: "The Ugly Duckling",
      image: "https://placehold.co/400x300/4ECDC4/FFFFFF?text=Ugly+Duckling",
      description: "A tale of self-discovery and acceptance"
    }
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-6 animate-bounce-slow">
          Classic Tales
        </h1>
        <p className="text-2xl text-text">
          Explore these timeless stories that have been loved by children for generations!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {classicStories.map((story) => (
          <div
            key={story.id}
            className="bg-white rounded-2xl shadow-soft overflow-hidden transform hover:scale-105 transition-all duration-200"
          >
            <div className="relative h-48">
              <img
                src={story.image}
                alt={story.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-primary mb-3">{story.title}</h2>
              <p className="text-lg text-text mb-6">{story.description}</p>
              <button
                onClick={() => navigate(`/story/${story.id}`)}
                className="w-full py-3 bg-accent text-text text-lg font-bold rounded-xl hover:bg-opacity-90 transition-colors duration-200 shadow-soft"
              >
                Read Story
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 