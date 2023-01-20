using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using myrate_backend.Areas.Data;
using myrate_backend.Models;

namespace myrate_backend.Data
{
    public class MyRateDbContext : DbContext
    {
        public IHttpContextAccessor _httpContextAccessor;
        public MyRateDbContext(DbContextOptions<MyRateDbContext> options, IHttpContextAccessor http)
            : base(options)
        {
            _httpContextAccessor = http;
        }

        public DbSet<MyRateUser> Users { get; set; }
        public DbSet<Book> Books { get; set; }
        public DbSet<Movie> Movies { get; set; }
        public DbSet<TVShow> TvShows { get; set; }
        public DbSet<Music> Musics { get; set; }
        public DbSet<Rating> Ratings { get; set; }
        //public DbSet<Rating> Ratings { get; set; }

        public async Task SeedData()
        {
            // Check if already done
            if (Users.Any() && Books.Any() && Movies.Any() && TvShows.Any() && Musics.Any())
            {
                return;
            }
            // migrate
            Database.Migrate();
            
            // Build Users
            var u1 = CreateUser();
            var u2 = CreateUser();
            var u3 = CreateUser();
            var u4 = CreateUser();
            var u5 = CreateUser();

            u1.Email = "admin@utah.edu";
            u2.Email = "professor@utah.edu";
            u3.Email = "u0000000@utah.edu";
            u4.Email = "u0000001@utah.edu";
            u5.Email = "u0000002@utah.edu";

            u1.UserName = u1.Email;
            u2.UserName = u2.Email;
            u3.UserName = u3.Email;
            u4.UserName = u4.Email;
            u5.UserName = u5.Email;
            
            u1.EmailConfirmed = true;
            u2.EmailConfirmed = true;
            u3.EmailConfirmed = true;
            u4.EmailConfirmed = true;
            u5.EmailConfirmed = true;

            u1.Name = "Monkey D. Luffy";
            u2.Name = "Jim";
            u3.Name = "Shavly Lumirk";
            u4.Name = "Nicholas";
            u5.Name = "Alyse";

            await Users.AddAsync(u1);
            await Users.AddAsync(u2);
            await Users.AddAsync(u3);
            await Users.AddAsync(u4);
            await Users.AddAsync(u5);

            // Build Movies
            var mo1 = CreateMovie();
            var mo2 = CreateMovie();
            var mo3 = CreateMovie();
            var mo4 = CreateMovie();
            var mo5 = CreateMovie();

            mo1.Title = "movie 1";
            mo2.Title = "movie 2";
            mo3.Title = "movie 3";
            mo4.Title = "movie 4";
            mo5.Title = "movie 5";

            mo1.ReleaseDate = "January 1, 2018";
            mo2.ReleaseDate = "February 2, 2019";
            mo3.ReleaseDate = "March 3, 2020";
            mo4.ReleaseDate = "April 4, 2021";
            mo5.ReleaseDate = "May 5, 2022";

            mo1.Genre = "Romance";
            mo2.Genre = "Comedy";
            mo3.Genre = "Sci-Fi";
            mo4.Genre = "Horror";
            mo5.Genre = "Documentary";

            mo1.Summary = "";
            mo2.Summary = "";
            mo3.Summary = "";
            mo4.Summary = "";
            mo5.Summary = "";

            mo1.Director = "D1";
            mo2.Director = "D2";
            mo3.Director = "D3";
            mo4.Director = "D4";
            mo5.Director = "D5";

            await Movies.AddAsync(mo1);
            await Movies.AddAsync(mo2);
            await Movies.AddAsync(mo3);
            await Movies.AddAsync(mo4);
            await Movies.AddAsync(mo5);

            // Build TvShows
            var tv1 = CreateTvShow();
            var tv2 = CreateTvShow();
            var tv3 = CreateTvShow();
            var tv4 = CreateTvShow();
            var tv5 = CreateTvShow();

            tv1.Title = "One Piece";
            tv2.Title = "Naruto";
            tv3.Title = "Bleach";
            tv4.Title = "One Punch Man";
            tv5.Title = "Black Clover";

            tv1.ReleaseDate = "January 1, 1997";
            tv2.ReleaseDate = "January 2, 1997";
            tv3.ReleaseDate = "January 3, 1997";
            tv4.ReleaseDate = "January 4, 1997";
            tv5.ReleaseDate = "January 5, 1997";

            tv1.Genre = "Romance"; 
            tv2.Genre = "Sci-Fi";
            tv3.Genre = "Horror";
            tv4.Genre = "Slice of Life";
            tv5.Genre = "Comedy";

            tv1.Director = "D1";
            tv2.Director = "D2";
            tv3.Director = "D3";
            tv4.Director = "D4";
            tv5.Director = "D5";

            tv1.Summary = "";
            tv2.Summary = "";
            tv3.Summary = "";
            tv4.Summary = "";
            tv5.Summary = "";

            await TvShows.AddAsync(tv1);
            await TvShows.AddAsync(tv2);
            await TvShows.AddAsync(tv3);
            await TvShows.AddAsync(tv4);
            await TvShows.AddAsync(tv5);

            // Build Music
            var mu1 = CreateMusic();
            var mu2 = CreateMusic();
            var mu3 = CreateMusic();
            var mu4 = CreateMusic();
            var mu5 = CreateMusic();

            mu1.Title = "Song 1";
            mu2.Title = "Song 2";
            mu3.Title = "Song 3";
            mu4.Title = "Song 4";
            mu5.Title = "Song 5";

            mu1.ReleaseDate = "January 1, 2018";
            mu2.ReleaseDate = "February 2, 2019";
            mu3.ReleaseDate = "March 3, 2020";
            mu4.ReleaseDate = "April 4, 2021";
            mu5.ReleaseDate = "May 5, 2022";

            mu1.Genre = "Pop";
            mu2.Genre = "Hard Metal";
            mu3.Genre = "Rock";
            mu4.Genre = "Classical";
            mu5.Genre = "Country";

            await Musics.AddAsync(mu1);
            await Musics.AddAsync(mu2);
            await Musics.AddAsync(mu3);
            await Musics.AddAsync(mu4);
            await Musics.AddAsync(mu5);

            // Build Books
            var b1 = CreateBook();
            var b2 = CreateBook();
            var b3 = CreateBook();
            var b4 = CreateBook();
            var b5 = CreateBook();

            b1.Title = "Book 1";
            b2.Title = "Book 2";
            b3.Title = "Book 3";
            b4.Title = "Book 4";
            b5.Title = "Book 5";

            b1.ReleaseDate = "January 1, 1997";
            b2.ReleaseDate = "January 2, 1997";
            b3.ReleaseDate = "January 3, 1997";
            b4.ReleaseDate = "January 4, 1997";
            b5.ReleaseDate = "January 5, 1997";

            b1.Genre = "Romance";
            b2.Genre = "Sci-Fi";
            b3.Genre = "Horror";
            b4.Genre = "Slice of Life";
            b5.Genre = "Comedy";

            b1.Summary = "";
            b2.Summary = "";
            b3.Summary = "";
            b4.Summary = "";
            b5.Summary = "";

            await Books.AddAsync(b1);
            await Books.AddAsync(b2);
            await Books.AddAsync(b3);
            await Books.AddAsync(b4);
            await Books.AddAsync(b5);

            await SaveChangesAsync();
        }

        public MyRateUser CreateUser()
        {
            try
            {
                return Activator.CreateInstance<MyRateUser>();
            }
            catch
            {
                throw new InvalidOperationException($"Can't create an instance of '{nameof(MyRateUser)}'. " +
                    $"Ensure that '{nameof(MyRateUser)}' is not an abstract class and has a parameterless constructor, or alternatively " +
                    $"override the register page in /Areas/Identity/Pages/Account/Register.cshtml");
            }
        }

        // Movies
        public Movie CreateMovie()
        {
            try
            {
                return Activator.CreateInstance<Movie>();
            }
            catch
            {
                throw new InvalidOperationException($"Can't create an instance of '{nameof(Movie)}'. " +
                    $"Ensure that '{nameof(Movie)}' is not an abstract class and has a parameterless constructor, or alternatively " +
                    $"override the register page in /Areas/Identity/Pages/Account/Register.cshtml");
            }
        }

        //TV Shows
        public TVShow CreateTvShow()
        {
            try
            {
                return Activator.CreateInstance<TVShow>();
            }
            catch
            {
                throw new InvalidOperationException($"Can't create an instance of '{nameof(TVShow)}'. " +
                    $"Ensure that '{nameof(TVShow)}' is not an abstract class and has a parameterless constructor, or alternatively " +
                    $"override the register page in /Areas/Identity/Pages/Account/Register.cshtml");
            }
        }

        //Books
        public Book CreateBook()
        {
            try
            {
                return Activator.CreateInstance<Book>();
            }
            catch
            {
                throw new InvalidOperationException($"Can't create an instance of '{nameof(Book)}'. " +
                    $"Ensure that '{nameof(Book)}' is not an abstract class and has a parameterless constructor, or alternatively " +
                    $"override the register page in /Areas/Identity/Pages/Account/Register.cshtml");
            }
        }

        //Music
        public Music CreateMusic()
        {
            try
            {
                return Activator.CreateInstance<Music>();
            }
            catch
            {
                throw new InvalidOperationException($"Can't create an instance of '{nameof(Music)}'. " +
                    $"Ensure that '{nameof(Music)}' is not an abstract class and has a parameterless constructor, or alternatively " +
                    $"override the register page in /Areas/Identity/Pages/Account/Register.cshtml");
            }
        }
    }
}
