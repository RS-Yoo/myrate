using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace myrate_backend.Migrations
{
    public partial class Collection : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Books_MediaCollection_MediaCollectionId",
                table: "Books");

            migrationBuilder.DropForeignKey(
                name: "FK_MediaCollection_Users_MyRateUserId",
                table: "MediaCollection");

            migrationBuilder.DropForeignKey(
                name: "FK_Movies_MediaCollection_MediaCollectionId",
                table: "Movies");

            migrationBuilder.DropForeignKey(
                name: "FK_Musics_MediaCollection_MediaCollectionId",
                table: "Musics");

            migrationBuilder.DropForeignKey(
                name: "FK_TvShows_MediaCollection_MediaCollectionId",
                table: "TvShows");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MediaCollection",
                table: "MediaCollection");

            migrationBuilder.RenameTable(
                name: "MediaCollection",
                newName: "Collections");

            migrationBuilder.RenameIndex(
                name: "IX_MediaCollection_MyRateUserId",
                table: "Collections",
                newName: "IX_Collections_MyRateUserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Collections",
                table: "Collections",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Books_Collections_MediaCollectionId",
                table: "Books",
                column: "MediaCollectionId",
                principalTable: "Collections",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Collections_Users_MyRateUserId",
                table: "Collections",
                column: "MyRateUserId",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Movies_Collections_MediaCollectionId",
                table: "Movies",
                column: "MediaCollectionId",
                principalTable: "Collections",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Musics_Collections_MediaCollectionId",
                table: "Musics",
                column: "MediaCollectionId",
                principalTable: "Collections",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TvShows_Collections_MediaCollectionId",
                table: "TvShows",
                column: "MediaCollectionId",
                principalTable: "Collections",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Books_Collections_MediaCollectionId",
                table: "Books");

            migrationBuilder.DropForeignKey(
                name: "FK_Collections_Users_MyRateUserId",
                table: "Collections");

            migrationBuilder.DropForeignKey(
                name: "FK_Movies_Collections_MediaCollectionId",
                table: "Movies");

            migrationBuilder.DropForeignKey(
                name: "FK_Musics_Collections_MediaCollectionId",
                table: "Musics");

            migrationBuilder.DropForeignKey(
                name: "FK_TvShows_Collections_MediaCollectionId",
                table: "TvShows");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Collections",
                table: "Collections");

            migrationBuilder.RenameTable(
                name: "Collections",
                newName: "MediaCollection");

            migrationBuilder.RenameIndex(
                name: "IX_Collections_MyRateUserId",
                table: "MediaCollection",
                newName: "IX_MediaCollection_MyRateUserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MediaCollection",
                table: "MediaCollection",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Books_MediaCollection_MediaCollectionId",
                table: "Books",
                column: "MediaCollectionId",
                principalTable: "MediaCollection",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MediaCollection_Users_MyRateUserId",
                table: "MediaCollection",
                column: "MyRateUserId",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Movies_MediaCollection_MediaCollectionId",
                table: "Movies",
                column: "MediaCollectionId",
                principalTable: "MediaCollection",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Musics_MediaCollection_MediaCollectionId",
                table: "Musics",
                column: "MediaCollectionId",
                principalTable: "MediaCollection",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TvShows_MediaCollection_MediaCollectionId",
                table: "TvShows",
                column: "MediaCollectionId",
                principalTable: "MediaCollection",
                principalColumn: "Id");
        }
    }
}
