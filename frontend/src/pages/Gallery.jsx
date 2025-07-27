import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { galleryService } from '../services/index.js';
import { showError } from '../services/utils.js';
import '../styles/Gallery.css';
import cafeInterior from '../assets/gallery-cafe-interior.webp';
import ribeyeSteak from '../assets/gallery-ribeye-steak.webp';
import specialEvent from '../assets/gallery-special-event.webp';
import barArea from '../assets/gallery-bar-area.jpg';
import privateDining from '../assets/gallery-private-dining.jpg';
import seasonalDecor from '../assets/gallery-seasonal-decor.jpg';

// Static gallery data as fallback (from SRS requirements)
const staticImages = [
  { image_url: cafeInterior, title: 'Café Fausse Interior', description: 'Café Fausse Interior' },
  { image_url: ribeyeSteak, title: 'Ribeye Steak Dish', description: 'Ribeye Steak Dish' },
  { image_url: specialEvent, title: 'Special Event at Café Fausse', description: 'Special Event at Café Fausse' },
  { image_url: barArea, title: 'Bar Area', description: 'Elegant bar area with craft cocktails' },
  { image_url: privateDining, title: 'Private Dining Room', description: 'Intimate private dining experience' },
  { image_url: seasonalDecor, title: 'Seasonal Decorations', description: 'Beautiful seasonal restaurant ambiance' },
];

const staticAwards = [
  { title: 'Culinary Excellence Award', year: '2022' },
  { title: 'Restaurant of the Year', year: '2023' },
  { title: 'Best Fine Dining Experience', description: 'Foodie Magazine, 2023' },
];

const staticReviews = [
  { content: 'Exceptional ambiance and unforgettable flavors.', author: 'Gourmet Review' },
  { content: 'A must-visit restaurant for food enthusiasts.', author: 'The Daily Bite' },
];

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [awards, setAwards] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [useBackend, setUseBackend] = useState(false);

  useEffect(() => {
    const loadGalleryData = async () => {
      try {
        setLoading(true);
        const [imagesData, awardsData, reviewsData] = await Promise.all([
          galleryService.getAllImages(),
          galleryService.getAllAwards(),
          galleryService.getAllReviews()
        ]);
        
        // Use backend data if available, otherwise use static data
        if (imagesData && imagesData.length > 0) {
          setImages(imagesData);
          setAwards(awardsData || []);
          setReviews(reviewsData || []);
          setUseBackend(true);
        } else {
          // Use static data if backend returns empty
          setImages(staticImages);
          setAwards(staticAwards);
          setReviews(staticReviews);
          setUseBackend(false);
        }
      } catch (err) {
        console.log('Using static gallery data:', err.message);
        setImages(staticImages);
        setAwards(staticAwards);
        setReviews(staticReviews);
        setUseBackend(false);
      } finally {
        setLoading(false);
      }
    };

    loadGalleryData();
  }, []);

  if (loading) {
    return (
      <div className="gallery-container">
        <h2 className="page-title">Gallery</h2>
        <Card>
          <div className="loading-message">Loading gallery...</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="gallery-container">
      <h2 className="page-title">Gallery</h2>
      
      {images.length > 0 && (
        <Card>
          <div className="gallery-images">
            {images.map((img, idx) => (
              <img
                key={useBackend ? img.id : `static-${idx}`}
                src={img.image_url}
                alt={img.title || img.description}
                className="gallery-img"
              />
            ))}
          </div>
        </Card>
      )}

      {awards.length > 0 && (
        <Card>
          <section className="gallery-awards">
            <h3>Awards</h3>
            <ul>
              {awards.map((award, index) => (
                <li key={useBackend ? award.id : `static-award-${index}`}>
                  <strong>{award.title}</strong>
                  {award.year && ` – ${award.year}`}
                  {award.description && ` – ${award.description}`}
                </li>
              ))}
            </ul>
          </section>
        </Card>
      )}

      {reviews.length > 0 && (
        <Card>
          <section className="gallery-reviews">
            <h3>Customer Reviews</h3>
            <ul>
              {reviews.map((review, index) => (
                <li key={useBackend ? review.id : `static-review-${index}`}>
                  <blockquote>"{review.content}"</blockquote>
                  <cite>– {review.author}</cite>
                  {review.source && <span className="review-source"> ({review.source})</span>}
                </li>
              ))}
            </ul>
          </section>
        </Card>
      )}

      {images.length === 0 && awards.length === 0 && reviews.length === 0 && (
        <Card>
          <div className="empty-message">No gallery content available.</div>
        </Card>
      )}
    </div>
  );
};

export default Gallery; 